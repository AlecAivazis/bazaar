// @flow
// external imports
import React from 'react'
import { View, Text } from 'react-native-web'
import { createFragmentContainer, graphql } from 'react-relay'
import moment from 'moment'
import { countBy } from 'lodash'
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

    // the list of sorted counts
    const sparklineData = Object.keys(dayCount)
        .sort(function(a, b) {
            return moment(a) - moment(b)
        })
        .map(key => dayCount[key])

    return (
        <View style={[styles.container, style]}>
            <View style={styles.infoContainer}>
                <Text style={styles.title}>
                    {project.repository ? project.repository.name : 'repository not found'}
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
    )
}

export default createFragmentContainer(
    ProjectRow,
    graphql`
        fragment ProjectRow_project on Project {
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
