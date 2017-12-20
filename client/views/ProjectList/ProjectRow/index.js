// @flow
// external imports
import React from 'react'
import { View } from 'react-native-web'
import { createFragmentContainer, graphql } from 'react-relay'
import moment from 'moment'
import { countBy } from 'lodash'
import { Link } from 'react-router-dom'
import { Title, Text } from 'quark-web'
// local imports
import type { ProjectRow_project } from './__generated__/ProjectRow_project.graphql.js'
import styles from './styles'
import { Sparkline, RepositoryOpenIssues, ListRow } from '../../../components'

const ProjectRow = ({ project, style, last }: { project: ProjectRow_project, style: any, last: boolean }) => {
    // guards
    if (!project.transactions || !project.transactions.edges) {
        throw new Error('Could not find transactions associated with this project.')
    }

    // group the transactions by the day they occured

    // the count of transactions by day
    const dayCount = countBy(project.transactions.edges.map(edge => edge && edge.node), datum => {
        return moment(datum.created_at)
            .startOf('day')
            .format()
    })
    // the sparkline data
    const sparklineData = []

    // the starting date
    let day = moment()
        .startOf('day')
        .subtract(14, 'days')

    // iterate over every day between our starting date and now
    while (day.isSameOrBefore(moment())) {
        // add an entry for the day in the sparkline
        sparklineData.push(dayCount[day.format()] || 0)
        // move to the next day
        day = day.add(1, 'day')
    }
    if (!project || !project.repository || !project.repository.languages || !project.repository.languages.edges) {
        throw new Error('Could not compute project language')
    }

    // find the color of the project
    const color =
        project.repository.languages.edges && project.repository.languages.edges[0]
            ? project.repository.languages.edges[0].node.color
            : null

    return (
        <Link to={`/${project.repoID}`}>
            <ListRow style={style} last={last}>
                <View style={styles.infoContainer}>
                    <Title style={styles.title}>
                        {project.repository
                            ? `${project.repository.owner.login} / ${project.repository.name}`
                            : 'repository not found'}
                    </Title>
                    <View style={styles.statContainer}>
                        <Text style={styles.stat}>{project.totalEarned} Ξ earned</Text>
                        <Text style={styles.stat}>
                            <RepositoryOpenIssues repository={project.repository}>
                                {openIssues => `${openIssues} open issues`}
                            </RepositoryOpenIssues>
                        </Text>
                        <Text style={styles.stat}>
                            {project.contributors.count} contributor{(project.contributors.count || 0) > 1 && 's'}
                        </Text>
                    </View>
                </View>
                <Sparkline
                    data={sparklineData.length > 0 ? sparklineData : [1, 1]}
                    style={{ width: 285 }}
                    color={color}
                    width={285}
                    height={44}
                />
            </ListRow>
        </Link>
    )
}

export default createFragmentContainer(
    ProjectRow,
    graphql`
        fragment ProjectRow_project on Project {
            repoID
            totalEarned
            transactions {
                edges {
                    node {
                        created_at
                    }
                }
            }
            contributors {
                count
            }
            repository {
                name
                owner {
                    login
                }
                ...OpenIssues_repository
                languages(first: 1, orderBy: { field: SIZE, direction: DESC }) {
                    edges {
                        node {
                            color
                        }
                    }
                }
            }
        }
    `
)
