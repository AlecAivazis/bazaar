// external imports
import { graphql } from 'graphql'
// local imports
import { initDb, cleanDb } from '../../database'
import schema from '..'

describe('API', () => {
    describe('Project', () => {
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

        it('can be located on the root object', async () => {
            // the query for each project and its transactions
            const query = `
                query {
                    project(repoID: "AlecAivazis/survey") {
                        repoID
                    }
               }
            `

            // execute the query
            const result = await graphql(schema, query)

            // make sure nothing went wrong
            expect(result.errors).toBeUndefined()

            // make sure the ID matches what we supplied
            expect(result.data.project.repoID).toEqual('AlecAivazis/survey')
        })

        it('can find the transactions associated with a project', async () => {
            // the query for each project and its transactions
            const query = `
                query {
                    project(repoID: "AlecAivazis/survey") {
                        transactions {
                            edges {
                                node {
                                    amount
                                }
                            }
                        }
                    }
               }
            `

            // execute the query
            const result = await graphql(schema, query)

            // make sure nothing went wrong
            expect(result.errors).toBeUndefined()

            // make sure we got all of the transactions
            const transactions = result.data.project.transactions.edges.map(({ node }) => node)

            // sort the transactions amounts
            const amounts = transactions.map(({ amount }) => amount).sort()

            // make sure we got each amount
            expect(amounts).toEqual([1, 2, 3, 4])
        })
    })
})