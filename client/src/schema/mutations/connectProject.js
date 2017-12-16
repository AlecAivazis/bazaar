// @flow

// the function to create the git hook
const createGithubHook = async ({ owner, name, accessToken }) => {
    // the hostname of the url that recieves the webhook
    const webhookHost = process.env.GITHUB_WEBHOOK_HOST || 'http://example.com'
    // create the bazr git hook
    const response = await fetch(`https://api.github.com/repos/${owner}/${name}/hooks?access_token=${accessToken}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'web',
            active: true,
            events: ['push', 'pull_request'],
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

const createProjectRecord = ({ owner, name }) =>
    new Promise(async (resolve, reject) => {
        // create the bazr git hook
        const response = await fetch(`/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `mutation {
                    CreateProject(input: {repoID: "${owner}/${name}"}) {
                      project {
                        id
                      }
                    }
                }`
            })
        })

        // if we weren't successful
        if (String(response.status)[0] !== '2') {
            // yell loudly
            reject(await response.text())
        }

        // we're done here
        resolve()
    })

const deleteProjectRecord = ({ owner, name }) =>
    new Promise(async (resolve, reject) => {
        // create the bazr git hook
        const response = await fetch(`/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `mutation {
                  DeleteProject(input: {repoID: "${owner}/${name}"})
            }`
            })
        })

        // if we weren't successful
        if (String(response.status)[0] !== '2') {
            // yell loudly
            reject(await response.text())
        }

        // we're done here
        resolve()
    })

export default async (_, { input }) => {
    // create the project in the centralized database
    await createProjectRecord(input)
    try {
        // then create the githook
        await createGithubHook(input)
        // if we failed to create the git hook
    } catch (err) {
        // delete the project
        await deleteProjectRecord(input)
        // bubble up
        throw err
    }

    // we were successful
    return true
}
