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

        test('can find a project by id', async () => {
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
    })
})
