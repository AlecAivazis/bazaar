// external imports
import { graphql } from 'graphql'
import { toGlobalId } from 'graphql-relay'
// local imports
import database, { migrateDb, cleanDb } from '../../database'
import schema from '..'

beforeEach(migrateDb)
afterEach(cleanDb)

test('can find the constraints attached with a particular fund', async () => {
    // create a fund we can test with
    const [fundId] = await database('funds').insert({ name: 'My Awesome Fund', address: '123' })
    // add some constraints to the fun
    await database.batchInsert(
        'constraints',
        [
            { fundId, field: 'language', bound: 'equals', value: 'JavaScript' },
            { fundId, field: 'stars', bound: 'lessThan', value: '100' },
            { fundId, field: 'stars', bound: 'greaterThan', value: '1' }
        ],
        3
    )
    // get the constraints for the fund we just made
    const { data, errors } = await graphql(
        schema,
        `
          {
            node(id: "${toGlobalId('Fund', fundId)}") {
              ... on Fund {
                constraints {
                  edges {
                    node {
                      ... on StarConstraint {
                        bound
                        value
                      }

                      ... on LanguageConstraint {
                        value
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
    expect(errors).toBeFalsy()

    // make sure we were able to retrieve the constraints
    expect(data.node.constraints.edges).toEqual([
        {
            node: {
                value: 'JavaScript'
            }
        },
        {
            node: {
                bound: 'LESS_THAN',
                value: '1'
            }
        },
        {
            node: {
                bound: 'GREATER_THAN',
                value: '1'
            }
        }
    ])
})
