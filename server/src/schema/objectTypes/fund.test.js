// external imports
import { graphql } from 'graphql'
import { toGlobalId } from 'graphql-relay'
// local imports
import { initDb, cleanDb } from '../../database'
import schema from '..'

describe('API', () => {
    describe('Fund', () => {
        beforeEach(initDb)
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
            expect(result.data.node.name).toEqual("Bill Gate's fund")
        })

        test('can find the list of funds registered in the network', async () => {
            const result = await graphql(
                schema,
                `
                    query {
                        funds {
                            address
                        }
                    }
                `
            )

            // make sure nothing went wrong
            expect(result.errors).toBeUndefined()

            expect(result.data.funds.map(({ address }) => address).sort()).toEqual(['123', '234'])
        })
    })
})
