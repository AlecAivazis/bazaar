// external imports
import moment from 'moment'
// local imports
import database from '~/server/database'

// filterIssues performs the necessary checks to verify that an issue submission isn't malicious
export default async ({ repo, issues: issueIds }) => {
    // QUESTION: do we reward a subset of these issues? Is one issue out of these indication
    //           something funky is going on? If we allow PRs to partially reward, do we store
    //           some reference to the closed issue so we can resole it later?

    // get the information required from the project
    const [project] = await database('projects')
        .where({ repoID: `${repo._owner}/${repo._repo}` })
        .select('created_at', 'id', 'repoID')

    // if we don't recognize the project
    if (!project) {
        // something is wrong (how did we get the hook?) '
        return
    }

    // TODO: merge all of these requests into one

    // get the state of each issue as far as github is concerned
    let issues = (await Promise.all(
        issueIds.map(issue =>
            repo.query(`
                issue(number: ${issue}) {
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
            `)
        )
    ))
        .map(({ issue }) => issue)
        // we only care about issues that are closed after the project was created
        .filter(issue => moment(issue.closedAt).isAfter(project.created_at))

    const repository = await repo.query(`
        stargazers {
            totalCount
        }
        languages(first:1, orderBy:{field:SIZE, direction:DESC}) {
            node {
                name
            }
        }
    `)

    // return the data we computed in this step
    return [issues, project, repository]
}
