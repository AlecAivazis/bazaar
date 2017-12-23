// @flow
// local imports
import * as Github from '~/client/git'

export const deleteProjectRecord = ({ owner, name }) =>
    new Promise(async (resolve, reject) => {
        // create the bazr git hook
        const response = await fetch(`/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `mutation {
                  DeleteProject(input: {repoID: "${owner}/${name}"}) {
                      success
                  }
            }`
            })
        })
        // if we weren't successful
        if (String(response.status)[0] !== '2') {
            // yell loudly
            reject(await response.text())
            return
        }

        // we're done here
        resolve()
    })

export default async (_, { input }) => {
    // delete the project in the centralized database
    await deleteProjectRecord(input)
    // then delete the githook
    await Github.deleteWebHook(input)

    // we were successful
    return true
}
