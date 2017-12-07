// external imports
import { graphql } from 'graphql'
import { toGlobalId } from 'graphql-relay'
// local imports
import { initDb, cleanDb } from '../../../database'
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
                            UpdateUserRole(input: {
                                user: "${toGlobalId('BazrUser', 1)}",
                                project: "${toGlobalId('Project', 1)}",
                                role: CONTRIBUTOR
                            }) {
                                membership {
                                    role
                                    user {
                                        id
                                    }
                                }
                            }
                        }
                    `
                )

                // make sure there are no errors
                expect(result.errors).toBeUndefined()

                // make sure we got the membership back
                expect(result.data.UpdateUserRole.membership).toBeDefined()

                // make sure we updated the role of the user
                expect(result.data.UpdateUserRole.membership.role).toEqual('CONTRIBUTOR')
                // make sure we retrieved the right user
                expect(result.data.UpdateUserRole.membership.user.id).toEqual(
                    toGlobalId('BazrUser', 1)
                )
            })

            test('fails if updating unknown user', async () => {
                // look for the project with id 1
                const result = await graphql(
                    schema,
                    `
                        mutation {
                            UpdateUserRole(input: {
                                user: "${toGlobalId('BazrUser', 0)}",
                                project: "${toGlobalId('Project', 1)}",
                                role: CONTRIBUTOR
                            }) {
                                membership {
                                    role
                                    user {
                                        id
                                    }
                                }
                            }
                        }
                    `
                )

                // make sure there are no errors
                expect(result.errors).toBeDefined()
            })

            test('fails if updating unknown project', async () => {
                // look for the project with id 1
                const result = await graphql(
                    schema,
                    `
                        mutation {
                            UpdateUserRole(input: {
                                user: "${toGlobalId('BazrUser', 1)}",
                                project: "${toGlobalId('Project', 0)}",
                                role: CONTRIBUTOR
                            }) {
                                membership {
                                    role
                                    user {
                                        id
                                    }
                                }
                            }
                        }
                    `
                )

                // make sure there are no errors
                expect(result.errors).toBeDefined()
            })

            test('fails when updating a user that does not belong to designated project', async () => {
                // look for the project with id 1
                const result = await graphql(
                    schema,
                    `
                        mutation {
                            UpdateUserRole(input: {
                                user: "${toGlobalId('BazrUser', 2)}",
                                project: "${toGlobalId('Project', 2)}",
                                role: CONTRIBUTOR
                            }) {
                                membership {
                                    role
                                    user {
                                        id
                                    }
                                }
                            }
                        }
                    `
                )

                // make sure there are no errors
                expect(result.errors).toBeDefined()
            })
        })
    })
})
