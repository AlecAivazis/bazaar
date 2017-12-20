// external imports
import { graphql } from 'graphql'
import { toGlobalId } from 'graphql-relay'
// local imports
import database, { migrateDb, cleanDb } from '../../database'
import schema from '..'

describe('API', () => {
    describe('User', () => {
        beforeEach(async () => {
            await migrateDb()

            // create some data to test with
            await database('users').insert({ accountName: 'AlecAivazis' })
        })
        afterEach(cleanDb)

        test('can find user by accountName', async () => {
            // find the transaction via the node endpoint
            const result = await graphql(
                schema,
                `
                    query {
                        bazrUser(accountName: "AlecAivazis") {
                            accountName
                        }
                    }
                `
            )

            // make sure there aren't any errors
            expect(result.errors).toBeUndefined()
            // make sure we found the right transaction
            expect(result.data.bazrUser.accountName).toEqual('AlecAivazis')
        })

        test('can find user by id', async () => {
            // find the transaction via the node endpoint
            const result = await graphql(
                schema,
                `
                  query {
                      node(id: "${toGlobalId('BazrUser', 1)}") {
                        ... on BazrUser {
                          accountName
                        }
                      }
                  }
              `
            )

            // make sure there aren't any errors
            expect(result.errors).toBeUndefined()
            // make sure we found the right transaction
            expect(result.data.node.accountName).toEqual('AlecAivazis')
        })
    })
})
