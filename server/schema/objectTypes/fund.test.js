// external imports
import { graphql } from 'graphql'
import { toGlobalId } from 'graphql-relay'
// local imports
import database, { migrateDb, cleanDb } from '../../database'
import schema from '..'

describe('API', () => {
    describe('Fund', () => {
        beforeEach(async () => {
            await migrateDb()

            await database.batchInsert(
                'funds',
                [{ name: 'fund1', address: '123' }, { name: 'fund2', address: '234' }],
                2
            )
        })
        afterEach(cleanDb)

        test('can find a fund by id', async () => {
            // look for the project with id 1
            const result = await graphql(
                schema,
                `
                    query {
                        node(id: "${toGlobalId('Fund', 1)}") {
                            ... on Fund {
                                name
                            }
                        }
                    }
                `
            )

            // make sure nothing went wrong
            expect(result.errors).toBeUndefined()
            // make sure we got the right project
            expect(result.data.node.name).toEqual('fund1')
        })

        test('can find the list of funds registered in the network', async () => {
            const result = await graphql(
                schema,
                `
                    query {
                        funds {
                            edges {
                                node {
                                    address
                                }
                            }
                        }
                    }
                `
            )

            // make sure nothing went wrong
            expect(result.errors).toBeUndefined()

            expect(result.data.funds.edges.map(({ node: { address } }) => address).sort()).toEqual(['123', '234'])
        })
    })
})
