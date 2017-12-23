// @flow
// local imports
import { deleteProjectRecord } from './deleteProject'
import * as Github from '~/client/git'

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

export default async (_, { input }) => {
    // create the project in the centralized database
    await createProjectRecord(input)
    try {
        // then create the githook
        await Github.createWebhook(input)
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
