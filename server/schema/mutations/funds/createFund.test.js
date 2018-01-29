// external imports
import { graphql } from 'graphql'
import { fromGlobalId } from 'graphql-relay'
// local imports
import database, { cleanDb, migrateDb } from '../../../database'
import schema from '../..'

beforeEach(migrateDb)
afterEach(cleanDb)

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

test('can create a fund with constraints', async () => {
    // create a fund with a known repoID
    const result = await graphql(
        schema,
        `
            mutation {
                CreateFund(
                    input: {
                        name: "My Fund123"
                        address: "1234"
                        constraints: { maxStars: 10, minStars: 1, language: "JavaScript" }
                    }
                ) {
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
        name: 'My Fund123',
        address: '1234'
    })

    // make sure we added the project to the database
    const [fund] = await database('funds')
        .select('id')
        .where({ name: 'My Fund123' })

    // make sure we added a constraint for the language
    expect(
        (await database('constraints')
            .where({ field: 'language', bound: 'equals', value: 'JavaScript', fundId: fund.id })
            .count())['count(*)']
    ).toEqual(1)

    expect(
        (await database('constraints')
            .where({ field: 'stars', bound: 'lessThan', value: '10', fundId: fund.id })
            .count())['count(*)']
    ).toEqual(1)

    expect(
        (await database('constraints')
            .where({ field: 'stars', bound: 'greaterThan', value: '1', fundId: fund.id })
            .count())['count(*)']
    ).toEqual(1)
})
