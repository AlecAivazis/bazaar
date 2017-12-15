// external imports
import { graphql } from 'graphql'
import { fromGlobalId } from 'graphql-relay'
// local imports
import database, { initDb, cleanDb } from '../../../database'
import schema from '../..'

describe('API', () => {
    describe('Project', () => {
        beforeEach(initDb)
        afterEach(cleanDb)

        describe('Update Role', () => {
            test('can update a user role', async () => {
                // look for the project with id 1
                const result = await graphql(
                    schema,
                    `
                        mutation {
                            DeleteProject(input: { repoID: "AlecAivazis/survey" }) {
                                success
                            }
                        }
                    `
                )

                // make sure there are no errors
                expect(result.errors).toBeUndefined()

                // make sure we got the project back
                expect(result.data.DeleteProject.success).toBeTruthy()

                // make sure we added the project to the database
                const project = await database('projects').where({ repoID: 'AlecAivazis/survey' })

                // make sure we made it
                expect(project).toHaveLength(0)
            })
        })
    })
})
