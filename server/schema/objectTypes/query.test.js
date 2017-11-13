// external imports
import { graphql } from 'graphql'
// local imports
import { initDb, cleanDb } from '../../database'
import schema from '..'

describe('API', () => {
    describe('Query', () => {
        beforeEach(initDb)
        afterEach(cleanDb)

        test('can retrieve list of projects', async () => {
            // the query for each project and its transactions
            const query = `
                query {
                    projects {
                        edges {
                            node {
                                repoID
                            }
                        }
                    }
                }
            `

            // execute the query
            const result = await graphql(schema, query)

            // make sure there were no errors
            expect(result.errors).toBeUndefined()

            // the projects we retrieved
            const projects = result.data.projects.edges.map(({ node: project }) => project)
            // the repoNames to look for
            const repoNames = [
                'AlecAivazis/survey',
                'AlecAivazis/redux-responsive',
                'AlecAivazis/feynman'
            ]

            for (const repoID of repoNames) {
                // there should be one project around survey
                expect(projects.find(project => project.repoID === repoID)).toBeTruthy()
            }
        })
    })
})
