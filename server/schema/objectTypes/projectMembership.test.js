// external imports
import { graphql } from 'graphql'
import { toGlobalId } from 'graphql-relay'
import moment from 'moment'
// local imports
import database, { migrateDb, cleanDb } from '../../database'
import schema from '..'

describe('API', () => {
    describe('Project', () => {
        beforeEach(async () => {
            await migrateDb()

            // create some users
            await database.batchInsert('users', [{ accountName: 'AlecAivazis' }, { accountName: 'aivazis' }], 10)
            // and some projects
            await database('projects').insert({ repoID: 'AlecAivazis/survey' })
            // join those members to the projects
            await database('project_membership').insert({ projectId: 1, userId: 1 })
            await database('project_membership').insert({ projectId: 1, userId: 2 })

            // add some transactions for the membership
            await database('transactions').insert([
                {
                    id: 1,
                    created_at: moment()
                        .utc()
                        .format(),
                    fund: 1,
                    recipientId: 1,
                    amount: 1,
                    project: 1
                },
                {
                    id: 2,
                    created_at: moment()
                        .subtract(1, 'day')
                        .utc()
                        .format(),
                    fund: 1,
                    recipientId: 1,
                    amount: 2,
                    project: 1
                },
                {
                    id: 3,
                    created_at: moment()
                        .subtract(1, 'day')
                        .utc()
                        .format(),
                    fund: 1,
                    recipientId: 1,
                    amount: 3,
                    project: 1
                },
                {
                    id: 4,
                    created_at: moment()
                        .subtract(3, 'day')
                        .utc()
                        .format(),
                    fund: 1,
                    recipientId: 2,
                    amount: 4,
                    project: 1
                }
            ])
        })
        afterEach(cleanDb)

        test('can find the contributors for a project', async () => {
            // find the total earned
            const result = await graphql(
                schema,
                `
                    query {
                        node(id: "${toGlobalId('Project', 1)}") {
                            ... on Project {
                                contributors {
                                    edges {
                                        node {
                                            project {
                                                id
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                `
            )

            // make sure nothing went wrong
            expect(result.errors).toBeUndefined()

            // make sure we got some sort of list back
            expect(result.data.node.contributors.edges).toBeTruthy()

            // make sure we computed the right total earned
            expect(result.data.node.contributors.edges.map(({ node }) => node.project.id)).toEqual([
                toGlobalId('Project', 1),
                toGlobalId('Project', 1)
            ])
        })

        test('can count the number of contributors', async () => {
            // find the number of contributors
            const result = await graphql(
                schema,
                `
                    query {
                        node(id: "${toGlobalId('Project', 1)}") {
                            ... on Project {
                                contributors {
                                    count
                                }
                            }
                        }
                    }
                `
            )

            // make sure nothing went wrong
            expect(result.errors).toBeUndefined()

            // make sure we got the right count
            expect(result.data.node.contributors.count).toEqual(2)
        })

        test('can find the user associated with a membership', async () => {
            // find the total earned
            const result = await graphql(
                schema,
                `
                query {
                    node(id: "${toGlobalId('Project', 1)}") {
                        ... on Project {
                            contributors {
                                edges {
                                    node {
                                        user {
                                            id
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `
            )

            // make sure nothing went wrong
            expect(result.errors).toBeUndefined()

            // make sure we got some sort of list back
            expect(result.data.node.contributors.edges).toBeTruthy()

            // make sure we computed the right total earned
            expect(result.data.node.contributors.edges.map(({ node }) => node.user.id)).toEqual([
                toGlobalId('BazrUser', 1),
                toGlobalId('BazrUser', 2)
            ])
        })

        test('can find the project associated with a membership', async () => {
            // find the total earned
            const result = await graphql(
                schema,
                `
                        query {
                            node(id: "${toGlobalId('Project', 1)}") {
                                ... on Project {
                                    contributors {
                                        edges {
                                            node {
                                                project {
                                                    repoID
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    `
            )

            // make sure nothing went wrong
            expect(result.errors).toBeUndefined()

            // make sure we got some sort of list back
            expect(result.data.node.contributors.edges).toBeTruthy()

            // make sure we computed the right total earned
            expect(result.data.node.contributors.edges.map(({ node }) => node.project.repoID)).toEqual([
                'AlecAivazis/survey',
                'AlecAivazis/survey'
            ])
        })

        test('can find the transactions associated with the membership', async () => {
            // find the total earned
            const result = await graphql(
                schema,
                `
                        query {
                            node(id: "${toGlobalId('Project', 1)}") {
                                ... on Project {
                                    contributors {
                                        edges {
                                            node {
                                                transactions {
                                                    edges {
                                                        node {
                                                            amount
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    `
            )

            // make sure nothing went wrong
            expect(result.errors).toBeUndefined()

            // make sure we got some sort of list back
            expect(result.data.node.contributors.edges[0].node.transactions.edges).toBeTruthy()

            // make sure we computed the right total earned
            expect(
                result.data.node.contributors.edges[0].node.transactions.edges.map(({ node }) => node.amount).sort()
            ).toEqual([1, 2, 3])
        })

        test('can compute the total amount earned by a given project membership', async () => {
            // find the total earned
            const result = await graphql(
                schema,
                `
                        query {
                            node(id: "${toGlobalId('Project', 1)}") {
                                ... on Project {
                                    contributors {
                                        edges {
                                            node {
                                                totalAmountEarned
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    `
            )

            // make sure nothing went wrong
            expect(result.errors).toBeUndefined()

            // make sure we got some sort of list back
            expect(result.data.node.contributors.edges[0].node.totalAmountEarned).toEqual(6)
        })
    })
})
