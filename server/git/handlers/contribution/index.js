// external imports
import moment from 'moment'
// local imports
import GithubRepo from '~/server/git/client'
import database from '~/server/database'
import _validatePR from './validatePR'
import _filterIssues from './filterIssues'
import _issuesInPR from './issuesInPR'
import _rewardContributor from './rewardContributor'

// this function handles the primary logic when a Pull Request event is recieved from
// a project webhook.
export default async ({ pull_request }, { repo } = {}) => {
    // if the PR is invalid
    if (!_validatePR(pull_request)) {
        // don't reward anyone anything
        return
    }

    // look up row of the contributor
    const contributor = pull_request.head.user.login

    // TODO: wrap all of these in a transaction

    // look for the list of users with that name
    const existingUsers = await database('users')
        .where({ accountName: contributor })
        .select('id', 'walletAddress')
    // the id of the target user
    let user

    // check if this is the first time we've encountered this user
    if (existingUsers.length === 0) {
        // if so, we need to create a user record
        user = {
            id: (await database('users').insert({ accountName: contributor }))[0]
        }
        // we know this user
    } else {
        // use the correct id
        user = existingUsers[0]
    }

    // make sure we only reward verified/valid issues designated by the pull request body
    const [issues, project, projectRepository] = await _filterIssues({
        repo: repo || new GithubRepo(pull_request.head.repo.owner.login, pull_request.head.repo.name),
        issues: _issuesInPR(pull_request.body)
    })

    // reward the contributor for the issues we approve
    await _rewardContributor({
        project,
        issues,
        user,
        repo: projectRepository
    })
}
