// external imports
import { graphql } from 'graphql'
import { toGlobalId } from 'graphql-relay'
// local imports
import { initDb, cleanDb } from '../../database'
import schema from '..'

describe('API', () => {
    describe('Transaction', () => {
        beforeEach(initDb)
        afterEach(cleanDb)

        it('can find transaction by id', async () => {
            // create a global ID from the id we are looking for
            const id = toGlobalId('Transaction', 1)

            // find the transaction via the node endpoint
            const result = await graphql(
                schema,
                `
                    query {
                        node(id: "${id}") {
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
            // create a global ID from the id we are looking for
            const id = toGlobalId('Transaction', 1)

            // find the transaction via the node endpoint
            const result = await graphql(
                schema,
                `
                    query {
                        node(id: "${id}") {
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
            // create a global ID from the id we are looking for
            const id = toGlobalId('Transaction', 1)

            // find the transaction via the node endpoint
            const result = await graphql(
                schema,
                `
                  query {
                      node(id: "${id}") {
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
    })
})
