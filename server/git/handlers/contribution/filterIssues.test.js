// external imports
import moment from 'moment'
// local imports
import database, { migrateDb, cleanDb } from '~/server/database'
import GithubRepo from '~/server/git/client'
import filterIssues from './filterIssues'

// make sure we have a valid database to test against
beforeEach(migrateDb)
afterEach(cleanDb)

test('filters out issues that were closed before the project was created', async () => {
    // create a filler project
    const [projectId] = await database('projects').insert({ repoId: 'test/repo', created_at: new Date() })
    // create a repo client we can spy on
    const repo = new GithubRepo('test', 'repo')

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
                state: 'CLOSED',
                number: 1,
                closedAt: moment()
                    .subtract(1, 'day')
                    .unix(),
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

    const [issues, project, projectRepo] = await filterIssues({
        repo,
        issues: [1]
    })

    // make sure we got all of our issues back
    expect(issues).toEqual([])

    // make sure we got the right id back
    expect(project.id).toEqual(projectId)

    // make sure we queried the api
    expect(repo._queries).toHaveLength(2)

    // make sure we got the repo back
    expect(projectRepo.stargazers.totalCount).toEqual(1)
})

test('filters out issues older than the project', async () => {
    const [recipientId] = await database('users').insert({ accountName: 'asdf' })
    const [projectId] = await database('projects').insert({ repoId: 'test/repo', created_at: new Date() })

    // a repo to spy on
    const repo = new GithubRepo('test', 'repo')
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
                closedAt: moment()
                    .subtract(1, 'day')
                    .unix(),
                comments: {
                    edges: [
                        {
                            node: {
                                reactions: {
                                    totalCount: 1
                                }
                            }
                        }
                    ]
                }
            }
        }
    })

    repo.mockQuery({
        query: `
            stargazers {
                totalCount
            }
            languages(first:1, orderBy:{field:SIZE, direction:DESC}) {
                edges {
                    node {
                        name
                    }
                }
            }
        `,
        value: { stargazers: { totalCount: 1 }, languages: { edges: [{ node: { name: 'JavaScript' } }] } }
    })

    const [issues, project, projectRepo] = await filterIssues({
        repo,
        issues: [1]
    })

    // make sure we got all of our issues back
    expect(issues).toEqual([])

    // make sure we got the right id back
    expect(project.id).toEqual(projectId)

    // make sure we queried the api
    expect(repo._queries).toHaveLength(2)

    // make sure we got the repo back
    expect(projectRepo.stargazers.totalCount).toEqual(1)
})

test('allows issues closed after the project was created', async () => {
    const [recipientId] = await database('users').insert({ accountName: 'asdf' })
    const [projectId] = await database('projects').insert({ repoId: 'test/repo', created_at: moment().unix() })

    // a repo to spy on
    const repo = new GithubRepo('test', 'repo')

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
                closedAt: moment()
                    .add(1, 'day')
                    .unix(),
                comments: {
                    edges: [
                        {
                            node: {
                                reactions: {
                                    totalCount: 1
                                }
                            }
                        }
                    ]
                }
            }
        }
    })

    repo.mockQuery({
        query: `
            stargazers {
                totalCount
            }
            languages(first:1, orderBy:{field:SIZE, direction:DESC}) {
             edges {
                node {
                    name
                }
            }
            }
        `,
        value: { stargazers: { totalCount: 1 }, languages: { edges: [{ node: { name: 'JavaScript' } }] } }
    })

    const [issues, project, projectRepo] = await filterIssues({
        repo,
        issues: [1]
    })

    // make sure we got all of our issues back
    expect(issues).toHaveLength(1)
    expect(issues.map(({ number }) => number)).toEqual([1])

    // make sure we got the right id back
    expect(project.id).toEqual(projectId)

    // make sure we queried the api
    expect(repo._queries).toHaveLength(2)

    // make sure we got the repo back
    expect(projectRepo.stargazers.totalCount).toEqual(1)
})
