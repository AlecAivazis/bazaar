import { recieveContribution } from '../welcome'

export default async (req, res) => {
    // the action of the event
    const { action, ...payload } = req.body

    // if the event represents a closed PR from the bot
    if (
        action === 'closed' &&
        payload.pull_request.merged_by &&
        payload.pull_request.user.login === 'bazr-bot'
    ) {
        // pass the project and user information to associate
        await recieveContribution({
            repoID: payload.repository.full_name,
            user: payload.pull_request.merged_by.login
        })
    }
    // we're done here
    return res.send('OK')
}
