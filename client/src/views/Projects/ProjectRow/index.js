// @flow
// external imports
import React from 'react'
import { View, Text } from 'react-native-web'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import type { ProjectRow_project } from './__generated__/ProjectRow_project.graphql.js'
import styles from './styles'
import { Sparkline } from '../../../components'

const ProjectRow = ({ project, style }: { project: ProjectRow_project, style: any }) => (
    <View style={[styles.container, style]}>
        <View style={styles.infoContainer}>
            <Text style={styles.title}>{project.repository ? project.repository.name : 'repository not found'}</Text>
            <View style={styles.statContainer}>
                <Text style={styles.stat}>{project.totalEarned} Ξ earned</Text>
                <Text style={styles.stat}>{project.repository.issues.totalCount} open issues</Text>
            </View>
        </View>
        <Sparkline
            data={[1, 2, 3]}
            style={{ width: 285 }}
            color={project.repository.languages.edges[0].node.color}
            width={285}
            height={44}
        />
    </View>
)

export default createFragmentContainer(
    ProjectRow,
    graphql`
        fragment ProjectRow_project on Project {
            totalEarned
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
