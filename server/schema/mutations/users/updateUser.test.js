// external imports
import { graphql } from 'graphql'
import { fromGlobalId, toGlobalId } from 'graphql-relay'
// local imports
import database, { migrateDb, cleanDb } from '../../../database'
import schema from '../..'

describe('API', () => {
    describe('Mutations', () => {
        beforeEach(migrateDb)
        afterEach(cleanDb)

        describe('UpdateUser', () => {
            test('can update a user', async () => {
                // create a user we can play with
                const [id] = await database('users').insert({ accountName: 'testUser' })

                // update a user with a known id
                const result = await graphql(
                    schema,
                    `
                        mutation {
                            UpdateUser(input: { id: "${toGlobalId('BazrUser', '1')}", walletAddress: "345" }) {
                                user {
                                    walletAddress
                                }
                            }
                        }
                    `
                )

                // make sure there are no errors
                expect(result.errors).toBeUndefined()

                // make sure we got the user back
                expect(result.data.UpdateUser.user.walletAddress).toEqual('345')

                // make sure we added the user to the database
                const user = await database('users').where({ accountName: 'testUser', walletAddress: '345' })

                // make sure we made it
                expect(user).toHaveLength(1)
            })
        })
    })
})
