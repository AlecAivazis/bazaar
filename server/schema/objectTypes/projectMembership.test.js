// external imports
import { graphql } from 'graphql'
import { toGlobalId } from 'graphql-relay'
// local imports
import { initDb, cleanDb } from '../../database'
import schema from '..'

describe('API', () => {
    describe('Project', () => {
        beforeEach(initDb)
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

        test('can compute the role of a user within a project', async () => {
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
                                            role
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
            expect(result.data.node.contributors.edges.map(({ node }) => node.role)).toEqual([
                'ADMIN',
                'ADMIN'
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
            expect(
                result.data.node.contributors.edges.map(({ node }) => node.project.repoID)
            ).toEqual(['AlecAivazis/survey', 'AlecAivazis/survey'])
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
                                                user {
                                                    accountName
                                                }
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
                result.data.node.contributors.edges[0].node.transactions.edges
                    .map(({ node }) => node.amount)
                    .sort()
            ).toEqual([1, 2, 3, 4])
        })
    })
})
