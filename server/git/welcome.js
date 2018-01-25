/*
  This module handles the Welcome PR workflow which is broken up into the follow steps:

    1. When a project is first registered with bazr, the webhook URL is hit by github
       which initializes this flow.

    2. The bot account needs to fork the project and submit a PR with a change to the README
       which provides some basic information introducing the project to bazr as well as
       adds a badge indicating the project is backed by bazr.

    3. When the user merges this PR, they will get their first contribution adding the project
       to the user's project list view
*/

// external imports
import fetch from 'isomorphic-fetch'
// local imports
import GithubRepo from './client'
import database from '../database'

export const createProjectFork = async ({ owner, repo }) => {
    // create a github client pointing to the repo
    const client = new GithubRepo(owner, repo)
    // fork the remote repo
    await client.fork()
}

export const createAndSendUpdate = async fork => {
    // point the client to the appropriate repo
    const repo = new GithubRepo(fork.owner.login, fork.name)

    // get the sha of the readme
    const [{ content, sha, path }, parent] = await Promise.all([repo.readme, repo.parent])

    // update the README file in the fork with the new contents
    await repo.updateFile({
        path,
        message: 'Updated readme',
        sha,
        content: Buffer.from('Hello World').toString('base64')
    })

    // submit a pr on the parent
    await parent.submitPR({
        title: 'Welcome to bazr',
        body: 'Hopefully this PR is useful to you',
        head: `${fork.owner.login}:master`,
        base: 'master'
    })
}

export const recieveContribution = async ({ repoID, user }) => {
    // look for the list of users with that name
    const existingUsers = await database('users').where({ accountName: user })

    // the id of the target user
    let userId

    // TODO: wrap all of these inserts in a transaction

    // check if this is the first time we've encountered this user
    if (existingUsers.length === 0) {
        // if so, we need to create a user record
        userId = (await database('users').insert({ accountName: user }))[0]
        // we know this user
    } else {
        // use the correct id
        userId = existingUsers[0].id
    }
    console.log('received contribution to', repoID)
    // if we recognize the project
    const projects = await database('projects').where({ repoID })
    if (projects.length === 1) {
        // the id of the project
        const projectId = projects[0].id

        // look for a membership that already exists
        const memberships = await database('project_membership').where({ userId, projectId })
        if (memberships.length === 0) {
            // add a membership entry
            await database('project_membership').insert({ userId, projectId })
        }

        // add a transaction between the user and the project
        await database('transactions').insert({
            recipientId: userId,
            project: projectId,
            amount: 0,
            fund: -1
        })
    }

    // create a client pointing to the bot's fork
    const forkRepo = new GithubRepo('bazr-bot', repoID.split('/')[1])
    // delete the bot's fork of the target project
    await forkRepo.delete()
}
