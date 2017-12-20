// external imports
import { graphql } from 'graphql'
import { fromGlobalId } from 'graphql-relay'
// local imports
import database, { cleanDb, migrateDb } from '../../../database'
import schema from '../..'

describe('API', () => {
    describe('Mutations', () => {
        beforeEach(migrateDb)
        afterEach(cleanDb)

        describe('CreateFund', () => {
            test('can create a fund', async () => {
                // create a fund with a known repoID
                const result = await graphql(
                    schema,
                    `
                        mutation {
                            CreateFund(input: { name: "My Fund", address: "1234" }) {
                                fund {
                                    name
                                    address
                                }
                            }
                        }
                    `
                )

                // make sure there are no errors
                expect(result.errors).toBeUndefined()

                // make sure we got the project back
                expect(result.data.CreateFund.fund).toEqual({
                    name: 'My Fund',
                    address: '1234'
                })

                // make sure we added the project to the database
                const funds = await database('funds')
                    .select('address')
                    .where({ name: 'My Fund' })

                // make sure we made it
                expect(funds).toHaveLength(1)
                expect(funds[0].address).toEqual('1234')
            })
        })
    })
})
