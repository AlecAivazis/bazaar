import { recieveContribution } from '../welcome'
import mergedContribution from './contribution'

export default async (req, res) => {
    // the action of the event
    const { action, pull_request, repository } = req.body

    // if we are looking at a merged PR
    if (
        req.headers['x-github-event'] === 'pull_request' && // a pull request
        action === 'closed' && // was closed
        pull_request.merged // and merged (or squashed...)
    ) {
        // if the event represents the welcome PR
        if (pull_request.user.login === 'bazr-bot') {
            // pass the project and user information to utility
            await recieveContribution({ pull_request })
        } else {
            // otherwise the closed PR represents a contribution to the project
            mergedContribution({ pull_request })
        }
    }

    // we're done here
    return res.send('OK')
}
