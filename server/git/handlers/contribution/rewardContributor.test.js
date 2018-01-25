// local imports
import database, { migrateDb, cleanDb } from '~/server/database'
import GithubRepo from '~/server/git/client'
import rewardContributor from './rewardContributor'

// make sure we have a valid database to test against
beforeEach(migrateDb)
afterEach(cleanDb)

const issueComments = { comments: { edges: [{ node: { reactions: { totalCount: 3 } } }] } }

const _mockRepo = {
    languages: { edges: [{ node: { name: 'JavaScript' } }] },
    stargazers: {
        totalCount: 1
    }
}

test('funds a transaction using resources from all eligible funds', async () => {
    const [projectId] = await database('projects').insert({ repoId: 'TestUser/repo1', created_at: new Date() })
    const [userId] = await database('users').insert({ accountName: 'asdf' })
    const [fundId1] = await database('funds').insert({ name: 'test fund1', address: '12344' })
    const [fundId2] = await database('funds').insert({ name: 'test fund2', address: '12345' })
    // add a language contraint to the fund
    await database('constraints').insert({
        fundId: fundId1,
        field: 'language',
        bound: 'equals',
        value: 'JavaScript'
    })
    await database('constraints').insert({
        fundId: fundId2,
        field: 'language',
        bound: 'equals',
        value: 'JavaScript'
    })

    // create a repo client we can spy on
    const repo = new GithubRepo('TestUser', 'repo1')

    // reward a random user
    await rewardContributor({
        user: { id: userId },
        project: { id: projectId },
        issues: [{ number: 1, ...issueComments }],
        repo: _mockRepo
    })

    // make sure there is a transaction from each fund
    expect(
        await database('transactions')
            .where({ recipientId: userId, project: projectId })
            .select('fund')
            .orderBy('id')
    ).toEqual([{ fund: fundId1 }, { fund: fundId2 }])
})

test('adds a non-zero amount transaction for the contribution', async () => {
    const [userId] = await database('users').insert({ accountName: 'asdf' })
    const [projectId] = await database('projects').insert({ repoId: 'test/repo', created_at: new Date() })
    const [fundId] = await database('funds').insert({ name: 'asdf' })

    // add a language contraint to the fund
    await database('constraints').insert({
        fundId,
        field: 'language',
        bound: 'equals',
        value: 'JavaScript'
    })

    // reward a random user
    await rewardContributor({
        user: { id: userId },
        project: { id: projectId },
        issues: [{ number: 1, ...issueComments }],
        repo: _mockRepo
    })

    // make sure we recorded a new transaction
    const transaction = (await database('transactions')
        .where({ recipientId: userId })
        .select('amount')
        .count())[0]

    // make sure we recorded a transaction
    expect(transaction['count(*)']).toEqual(1)
    // whos amount is what we expect
    expect(transaction.amount).toBeGreaterThan(0)
})

test('associates a transaction with an existing user', async () => {
    await database.batchInsert('users', [{ accountName: 'user' }, { accountName: 'asdf' }], 2)
    await database('funds').insert({ name: 'asdf' })

    const [projectId] = await database('projects').insert({ repoId: 'TestUser/repo1', created_at: new Date() })

    // reward a random user
    await rewardContributor({
        user: { id: 2 },
        project: { id: projectId },
        issues: [{ number: 1, ...issueComments }],
        repo: _mockRepo
    })

    // make sure we recorded a transaction
    expect(
        (await database('transactions')
            .where({ recipientId: 2 })
            .count())[0]['count(*)']
    ).toEqual(1)
})

test('creates records for PRs that close multiple transactions', async () => {
    const [recipientId] = await database('users').insert({ accountName: 'asdf' })
    const [projectId] = await database('projects').insert({ repoId: 'TestUser/repo1', created_at: new Date() })
    await database('funds').insert({ name: 'asdf' })

    // reward a random user
    await rewardContributor({
        user: { id: recipientId },
        project: { id: projectId },
        issues: [{ number: 1, ...issueComments }, { number: 2, ...issueComments }],
        repo: _mockRepo
    })

    // make sure we recorded a transaction
    expect(
        (await database('transactions')
            .where({ recipientId })
            .count())[0]['count(*)']
    ).toEqual(2)
})

test('adds a project membership record to match the transaction', async () => {
    const [projectId] = await database('projects').insert({ repoId: 'TestUser/repo1', created_at: new Date() })
    const [userId] = await database('users').insert({ accountName: 'asdf' })
    await database('funds').insert({ name: 'asdf' })

    // reward a random user
    await rewardContributor({
        user: { id: userId },
        project: { id: projectId },
        issues: [{ number: 1, ...issueComments }],
        repo: _mockRepo
    })

    // make sure we created a project membership
    expect(
        (await database('project_membership')
            .where({ userId, projectId })
            .count())[0]['count(*)']
    ).toEqual(1)
})
