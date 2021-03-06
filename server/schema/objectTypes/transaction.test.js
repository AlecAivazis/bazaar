// external imports
import { graphql } from 'graphql'
import { toGlobalId } from 'graphql-relay'
// local imports
import database, { migrateDb, cleanDb } from '../../database'
import schema from '..'

describe('API', () => {
    describe('Transaction', () => {
        beforeEach(async () => {
            await migrateDb()

            // create data to test with
            await Promise.all([
                database('funds').insert({ name: 'fund1', address: 'asdf' }),
                database('users').insert({ accountName: 'AlecAivazis' }),
                database('projects').insert({ repoId: 'AlecAivazis/survey' })
            ])
            await database('transactions').insert({ recipientId: 1, fund: 1, project: 1, amount: 1 })
        })
        afterEach(cleanDb)

        it('can find transaction by id', async () => {
            // find the transaction via the node endpoint
            const result = await graphql(
                schema,
                `
                    query {
                        node(id: "${toGlobalId('Transaction', 1)}") {
                          ... on Transaction {
                            amount
                          }
                        }
                    }
                `
            )

            // make sure there aren't any errors
            expect(result.errors).toBeUndefined()
            // make sure we found the right transaction
            expect(result.data.node.amount).toEqual(1)
        })

        it('can compute the fund associated with a transaction', async () => {
            // find the transaction via the node endpoint
            const result = await graphql(
                schema,
                `
                    query {
                        node(id: "${toGlobalId('Transaction', 1)}") {
                          ... on Transaction {
                            fund {
                              id
                            }
                          }
                        }
                    }
                `
            )

            // make sure there aren't any errors
            expect(result.errors).toBeUndefined()
            // make sure we found the right transaction
            expect(result.data.node.fund.id).toEqual(toGlobalId('Fund', 1))
        })

        it('can compute the project associated with a transaction', async () => {
            // find the transaction via the node endpoint
            const result = await graphql(
                schema,
                `
                  query {
                      node(id: "${toGlobalId('Transaction', 1)}") {
                        ... on Transaction {
                          project {
                            id
                          }
                        }
                      }
                  }
              `
            )

            // make sure there aren't any errors
            expect(result.errors).toBeUndefined()
            // make sure we found the right transaction
            expect(result.data.node.project.id).toEqual(toGlobalId('Project', 1))
        })

        it('can find the recipient of a transaction', async () => {
            // find the transaction via the node endpoint
            const result = await graphql(
                schema,
                `
                  query {
                    node(id: "${toGlobalId('Transaction', 1)}") {
                      ... on Transaction {
                        recipient {
                          id
                        }
                      }
                    }
                  }
              `
            )

            // make sure there aren't any errors
            expect(result.errors).toBeUndefined()
            // make sure we found the right transaction
            expect(result.data.node.recipient.id).toEqual(toGlobalId('BazrUser', 1))
        })
    })
})
