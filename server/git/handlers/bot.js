import { createAndSendUpdate } from '../welcome'

// this handler is called when one of the intended events is triggered
export default async (req, res) => {
    // grab the action out of the payload
    const { action, ...payload } = req.body
    // if we just created a fork of repository
    if (action === 'created' && payload.repository.fork) {
        // we can assume that we created this fork as part of the welcome flow
        // so we ned to update the contents of the remote repo and submit a PR
        // with the differences
        await createAndSendUpdate(payload.repository)
    }

    // we're done here
    res.send('OK')
}
