// external imports
import moment from 'moment'
// local imports
import database, { migrateDb, cleanDb } from '~/server/database'
import GithubRepo from '~/server/git/client'
import recieveContribution from '.'

describe('Merged Contributions', () => {
    beforeEach(migrateDb)
    afterEach(cleanDb)

    test('adds a record to the user table for the first contribution', async () => {
        await database('projects').insert({ repoId: 'TestUser/repo1', created_at: new Date() })
        await database('funds').insert({ name: 'asdf' })

        // create a repo client we can spy on
        const repo = new GithubRepo('TestUser', 'repo1')
        // the issues to credit
        const issues = [1]

        // mock the remote data
        repo.mockQuery({
            query: `
            issue(number: 1) {
                state
                number
                closedAt
                comments(first: 1){
                    edges {
                        node {
                            reactions(content:THUMBS_UP) {
                                totalCount
                            }
                        }
                    }
                }
            }
        `,
            value: {
                issue: {
                    state: 'OPEN',
                    number: 1,
                    comments: {
                        edges: []
                    }
                }
            }
        })

        repo.mockQuery({
            query: `stargazers {
                totalCount
            }
            languages(first:1, orderBy:{field:SIZE, direction:DESC}) {
                edges {
                    node {
                        name
                    }
                }
            }`,
            value: { stargazers: { totalCount: 1 }, languages: { edges: [{ node: { name: 'JavaScript' } }] } }
        })

        await recieveContribution(
            {
                pull_request: {
                    merged: true,
                    base: {
                        repo: {
                            default_branch: 'master'
                        },
                        ref: 'master'
                    },
                    head: {
                        user: {
                            login: 'asdf'
                        }
                    },
                    body: 'fixes #1'
                }
            },
            { repo }
        )

        // make sure we queried the api
        expect(repo._queries).toHaveLength(2)

        // make sure we created a user
        expect(
            (await database('users')
                .where({ accountName: 'asdf' })
                .count())[0]['count(*)']
        ).toEqual(1)
    })

    test('contributions can be attributed to existing users', async () => {
        await database('projects').insert({ repoId: 'TestUser/repo1', created_at: new Date() })
        await database('users').insert({ accountName: 'asdf1' })
        await database('users').insert({ accountName: 'asdf2' })
        await database('funds').insert({ name: 'asdf' })

        // add a language contraint to the fund
        await database('constraints').insert({
            fundId: 1,
            field: 'language',
            bound: 'equals',
            value: 'JavaScript'
        })

        // create a repo client we can spy on
        const repo = new GithubRepo('TestUser', 'repo1')
        // the issues to credit
        const issues = [1]

        // mock the remote data
        repo.mockQuery({
            query: `
            issue(number: 1) {
                state
                number
                closedAt
                comments(first: 1){
                    edges {
                        node {
                            reactions(content:THUMBS_UP) {
                                totalCount
                            }
                        }
                    }
                }
            }
        `,
            value: {
                issue: {
                    state: 'OPEN',
                    number: 1,
                    comments: {
                        edges: [{ node: { reactions: { totalCount: 1 } } }]
                    }
                }
            }
        })

        repo.mockQuery({
            query: `stargazers {
                totalCount
            }
            languages(first:1, orderBy:{field:SIZE, direction:DESC}) {
                edges {
                    node {
                    name
                }
            }
            }`,
            value: { stargazers: { totalCount: 1 }, languages: { edges: [{ node: { name: 'JavaScript' } }] } }
        })

        await recieveContribution(
            {
                pull_request: {
                    merged: true,
                    base: {
                        repo: {
                            default_branch: 'master'
                        },
                        ref: 'master'
                    },
                    head: {
                        user: {
                            login: 'asdf2'
                        }
                    },
                    body: 'fixes #1'
                }
            },
            { repo }
        )

        // make sure we queried the api
        expect(repo._queries).toHaveLength(2)

        // make sure we registered some transactions with that user
        expect(
            (await database('transactions')
                .where({ recipientId: 2 })
                .count())[0]['count(*)']
        ).toEqual(1)

        // make sure we didn't create an additional user
        expect((await database('users').count())[0]['count(*)']).toEqual(2)

        expect(
            (await database('transactions')
                .where({ recipientId: 2 })
                .select('amount')
                .count())[0].amount
        ).toBeGreaterThan(0)
    })
})
