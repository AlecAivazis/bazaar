// @flow

// the function to create the git hook
const createGithubHook = async ({ owner, name, accessToken }) => {
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
                url: 'http://example.com/webhook',
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
            const body = await response.text()
            console.log(body)
            reject(body)
        }

        // we're done here
        resolve()
    })

export default async (_, { input }) => {
    await Promise.all([createGithubHook(input), createProjectRecord(input)])
    // we were successful
    return true
}
