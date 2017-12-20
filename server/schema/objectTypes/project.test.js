// external imports
import { graphql } from 'graphql'
import { toGlobalId } from 'graphql-relay'
// local imports
import database, { migrateDb, cleanDb } from '../../database'
import schema from '..'

describe('API', () => {
    describe('Project', () => {
        beforeEach(async () => {
            await migrateDb()

            // create data to test with
            await Promise.all([
                database('funds').insert({ name: 'fund1', address: 'asdf' }),
                database('users').insert({ accountName: 'AlecAivazis' }),
                database.batchInsert(
                    'projects',
                    [
                        { repoId: 'AlecAivazis/survey' },
                        { repoId: 'AlecAivazis/redux-responsive' },
                        { repoId: 'AlecAivazis/feynman' }
                    ],
                    4
                )
            ])
            await database.batchInsert(
                'transactions',
                [
                    { recipientId: 1, fund: 1, project: 1, amount: 1 },
                    { recipientId: 1, fund: 1, project: 1, amount: 2 },
                    { recipientId: 1, fund: 1, project: 1, amount: 3 },
                    { recipientId: 1, fund: 1, project: 1, amount: 4 }
                ],
                4
            )
        })
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
            const repoNames = ['AlecAivazis/survey', 'AlecAivazis/redux-responsive', 'AlecAivazis/feynman']

            for (const repoID of repoNames) {
                // there should be one project around survey
                expect(projects.find(project => project.repoID === repoID)).toBeTruthy()
            }
        })

        test('can be located on the root object', async () => {
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

        test('can find the transactions associated with a project', async () => {
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

        test('can find a project by id', async () => {
            // look for the project with id 1
            const result = await graphql(
                schema,
                `
                    query {
                        node(id: "${toGlobalId('Project', 1)}") {
                            ... on Project {
                                repoID
                            }
                        }
                    }
                `
            )

            // make sure nothing went wrong
            expect(result.errors).toBeUndefined()
            // make sure we got the right project
            expect(result.data.node.repoID).toEqual('AlecAivazis/survey')
        })

        test('can compute the total amount earned in all transactions', async () => {
            // find the total earned
            const result = await graphql(
                schema,
                `
                    query {
                        node(id: "${toGlobalId('Project', 1)}") {
                            ... on Project {
                                totalEarned
                            }
                        }
                    }
                `
            )

            // make sure nothing went wrong
            expect(result.errors).toBeUndefined()
            // make sure we computed the right total earned
            expect(result.data.node.totalEarned).toEqual(10)
        })

        test('total amount earned defaults to 0', async () => {
            // find the total earned
            const result = await graphql(
                schema,
                `
                    query {
                        node(id: "${toGlobalId('Project', 2)}") {
                            ... on Project {
                                totalEarned
                            }
                        }
                    }
                `
            )

            // make sure nothing went wrong
            expect(result.errors).toBeUndefined()
            // make sure we computed the right total earned
            expect(result.data.node.totalEarned).toEqual(0)
        })
    })
})
