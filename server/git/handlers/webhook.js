import { recieveContribution } from '../welcome'
import mergedContribution from './contribution'

export default async (req, res) => {
    // the action of the event
    const { action, pull_request } = req.body

    // if we are looking at a merged PR
    if (
        req.headers['x-github-event'] === 'pull_request' && // a pull request
        action === 'closed' && // was closed
        pull_request.merged // and merged (or squashed...)
    ) {
        console.log('PR closed')
        // if the event represents the welcome PR
        if (pull_request.user.login === 'bazr-bot') {
            const { repo, user } = pull_request.base
            const repoID = `${repo.owner.login}/${repo.name}`
            // pass the project and user information to utility
            await recieveContribution({ repoID, user: user.login })
        } else {
            // otherwise the closed PR represents a contribution to the project
            mergedContribution({ pull_request })
        }
    }

    // we're done here
    return res.send('OK')
}
