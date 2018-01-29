// local imports
import database, { migrateDb, cleanDb } from '~/server/database'
import findProjectFunds from './findProjectFunds'

// make sure we have a valid database to test against
beforeEach(migrateDb)
afterEach(cleanDb)

test('can find funds that specify a language criteria', async () => {
    // create a fund
    const [positiveFundId] = await database('funds').insert({ name: 'My Fund', address: '1234' })
    // add a language contraint to the fund
    await database('constraints').insert({
        fundId: positiveFundId,
        field: 'language',
        bound: 'equals',
        value: 'JavaScript'
    })

    // create a fund that does not pass our search
    const [negativeFundId] = await database('funds').insert({ name: 'My Fund2', address: '12341' })
    // add a language contraint to the fund
    await database('constraints').insert({
        fundId: negativeFundId,
        field: 'language',
        bound: 'equals',
        value: 'Go'
    })

    // the project we are funding
    const project = {
        languages: {
            edges: [
                {
                    node: {
                        name: 'JavaScript'
                    }
                }
            ]
        },
        stargazers: {
            totalCount: 10
        }
    }

    // the amount we want to fund the project
    const amount = 1

    expect(await findProjectFunds(project, amount)).toEqual([
        { fund: { id: positiveFundId, address: '1234' }, amount: 1 }
    ])
})

test('can find funds that set a minimum star criteria', async () => {
    // create a fund
    const [fundId] = await database('funds').insert({ name: 'My Fund', address: '1234' })
    // add a language contraint to the fund
    await database('constraints').insert({
        fundId: fundId,
        field: 'stars',
        bound: 'lessThan',
        value: '20'
    })

    // the project we are funding
    const project = {
        languages: {
            edges: [
                {
                    node: {
                        name: 'JavaScript'
                    }
                }
            ]
        },
        stargazers: {
            totalCount: 10
        }
    }

    // the amount we want to fund the project
    const amount = 1

    expect(await findProjectFunds(project, amount)).toEqual([{ fund: { id: fundId, address: '1234' }, amount: 1 }])
})

test('can find funds that set a maximum star criteria', async () => {
    // create a fund
    const [fundId] = await database('funds').insert({ name: 'My Fund', address: '1234' })
    // add a language contraint to the fund
    await database('constraints').insert({
        fundId: fundId,
        field: 'stars',
        bound: 'lessThan',
        value: '20'
    })

    // the project we are funding
    const project = {
        languages: {
            edges: [
                {
                    node: {
                        name: 'JavaScript'
                    }
                }
            ]
        },
        stargazers: {
            totalCount: 10
        }
    }

    // the amount we want to fund the project
    const amount = 1

    expect(await findProjectFunds(project, amount)).toEqual([{ fund: { id: 1, address: '1234' }, amount: 1 }])
})

test('splits withdrawl across all matches', async () => {
    // create a fund
    const [fund1] = await database('funds').insert({ name: 'My Fund', address: '1234' })
    // add a language contraint to the fund
    await database('constraints').insert({
        fundId: fund1,
        field: 'language',
        bound: 'equals',
        value: 'JavaScript'
    })

    // create a fund that does not pass our search
    const [fund2] = await database('funds').insert({ name: 'My Fund2', address: '12341' })
    // add a language contraint to the fund
    await database('constraints').insert({
        fundId: fund2,
        field: 'language',
        bound: 'equals',
        value: 'JavaScript'
    })

    // the project we are funding
    const project = {
        languages: {
            edges: [
                {
                    node: {
                        name: 'JavaScript'
                    }
                }
            ]
        },
        stargazers: {
            totalCount: 10
        }
    }

    // the amount we want to fund the project
    const amount = 1

    expect(await findProjectFunds(project, amount)).toEqual([
        { fund: { id: 1, address: '1234' }, amount: 0.5 },
        { fund: { id: 2, address: '12341' }, amount: 0.5 }
    ])
})

test('handles funds that cannot fully support the project')

test('does not barf when repos have no registered language', async () => {
    // create a fund
    const [fund1] = await database('funds').insert({ name: 'My Funda', address: '1234', id: 10 })
    // add a language contraint to the fund
    await database('constraints').insert({
        fundId: fund1,
        field: 'language',
        bound: 'equals',
        value: 'JavaScript'
    })

    // the project we are funding
    const project = {
        languages: {
            edges: []
        },
        stargazers: {
            totalCount: 0
        }
    }

    // the amount we want to fund the project
    const amount = 1

    // make sure we eidn't get any funds back
    expect(await findProjectFunds(project, amount)).toEqual([])
})
