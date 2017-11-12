// @flow
// external imports
import React from 'react'
import { View, Text } from 'react-native-web'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import type { ProjectRow_project } from './__generated__/ProjectRow_project.graphql.js'
import styles from './styles'

const ProjectRow = ({ project, style }: { project: ProjectRow_project, style: any }) => (
    <View style={[styles.container, style]}>
        <View style={styles.infoContainer}>
            <Text style={styles.title}>{project.repository ? project.repository.name : 'repository not found'}</Text>
        </View>
    </View>
)

export default createFragmentContainer(
    ProjectRow,
    graphql`
        fragment ProjectRow_project on Project {
            repository {
                name
            }
        }
    `
)
