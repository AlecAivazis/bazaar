// @flow
// external imports
import React from 'react'
import { View, Text } from 'react-native-web'
import { createFragmentContainer, graphql } from 'react-relay'
import moment from 'moment'
import { countBy } from 'lodash'
import { BooleanState } from 'quark-web'
import { Link } from 'react-router-dom'
// local imports
import type { ProjectRow_project } from './__generated__/ProjectRow_project.graphql.js'
import styles from './styles'
import { Sparkline } from '../../../components'

const ProjectRow = ({ project, style }: { project: ProjectRow_project, style: any }) => {
    // group the transactions by the day they occured

    // the count of transactions by day
    const dayCount = countBy(project.transactions.edges.map(({ node }) => node), datum => {
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

    return (
        <BooleanState>
            {({ state, set }) => (
                <Link to={`/${project.repoID}`}>
                    <View
                        style={[state ? styles.containerHover : styles.container, style]}
                        onMouseEnter={() => set(true)}
                        onMouseLeave={() => set(false)}
                    >
                        <View style={styles.infoContainer}>
                            <Text style={styles.title}>
                                {project.repository
                                    ? `${project.repository.owner.login} / ${project.repository.name}`
                                    : 'repository not found'}
                            </Text>
                            <View style={styles.statContainer}>
                                <Text style={styles.stat}>{project.totalEarned} Ξ earned</Text>
                                <Text style={styles.stat}>{project.repository.issues.totalCount} open issues</Text>
                                <Text style={styles.stat}>
                                    {project.contributors.count} contributor{project.contributors.count > 1 && 's'}
                                </Text>
                            </View>
                        </View>
                        <Sparkline
                            data={sparklineData.length > 0 ? sparklineData : [1, 1]}
                            style={{ width: 285 }}
                            color={project.repository.languages.edges[0].node.color}
                            width={285}
                            height={44}
                        />
                    </View>
                </Link>
            )}
        </BooleanState>
    )
}

export default createFragmentContainer(
    ProjectRow,
    graphql`
        fragment ProjectRow_project on Project {
            repoID
            totalEarned
            contributors {
                count
            }
            transactions {
                edges {
                    node {
                        created_at
                    }
                }
            }
            repository {
                name
                owner {
                    login
                }
                issues(states: [OPEN]) {
                    totalCount
                }
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
