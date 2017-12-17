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
    const [{ content, sha, path }, parent] = await Promise.all([
        await repo.readme,
        await repo.parent
    ])

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

export const recieveContribution = async () => {}
