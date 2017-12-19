// external imports
import { graphql } from 'graphql'
import { fromGlobalId } from 'graphql-relay'
// local imports
import database, { initDb, cleanDb } from '../../../database'
import schema from '../..'

describe('API', () => {
    describe('Mutations', () => {
        beforeEach(initDb)
        afterEach(cleanDb)

        describe('CreateProject', () => {
            test('can create a project', async () => {
                // create a project with a known repoID
                const result = await graphql(
                    schema,
                    `
                        mutation {
                            CreateProject(input: { repoID: "AlecAivazis/quark" }) {
                                project {
                                    id
                                }
                            }
                        }
                    `
                )

                // make sure there are no errors
                expect(result.errors).toBeUndefined()

                // make sure we got the project back
                expect(fromGlobalId(result.data.CreateProject.project.id).id).toEqual('4')

                // make sure we added the project to the database
                const project = await database('projects').where({ repoID: 'AlecAivazis/quark' })

                // make sure we made it
                expect(project).toHaveLength(1)
            })
        })
    })
})
