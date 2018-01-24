// the hostname of the url that recieves the webhook
const webhookHost = process.env.GITHUB_WEBHOOK_HOST || 'http://example.com'

// the function to create the git hook
export const createWebhook = async ({ owner, name, accessToken }) => {
    // create the bazr git hook
    const response = await fetch(`https://api.github.com/repos/${owner}/${name}/hooks?access_token=${accessToken}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'web',
            active: true,
            events: ['push', 'pull_request', 'issues'],
            config: {
                // default to a no-op web hook
                url: `${webhookHost}/webhook`,
                content_type: 'json'
            }
        })
    })

    // if we weren't successful
    if (String(response.status)[0] !== '2') {
        const body = await response.json()

        // yell loudly
        throw new Error(JSON.stringify(body.errors[0]))
    }
}

export const deleteWebHook = async ({ owner, name, accessToken }) => {
    // get the list of hooks
    const hooks = await (await fetch(
        `https://api.github.com/repos/${owner}/${name}/hooks?access_token=${accessToken}`
    )).json()

    // find the hooks that are based off of the current hook url
    const targets = hooks.filter(({ config: { url } }) => {
        // create an in-memory link we can use to parse the url
        const link = document.createElement('a')
        link.href = url

        // find the hostname of the url
        const { protocol, hostname } = link

        // only return hooks with the matching hostname and protocol
        return `${protocol}//${hostname}` === webhookHost
    })

    // make sure we found some webhooks
    if (targets.length === 0) {
        throw new Error('Could not find webhook')
    }

    // delete each webhook in parallel
    await Promise.all(
        targets.map(async ({ id }) => {
            const response = await fetch(
                `https://api.github.com/repos/${owner}/${name}/hooks/${id}?access_token=${accessToken}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )

            // if we weren't successful
            if (String(response.status)[0] !== '2') {
                // yell loudly
                throw new Error(await response.text())
            }
        })
    )
}
