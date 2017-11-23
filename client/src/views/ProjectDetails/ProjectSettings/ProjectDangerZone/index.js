// @flow
// external imports
import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { View } from 'react-native-web'
import { Text, H3, WarningButton } from 'quark-web'
// local imports
import styles from './styles'
import type { ProjectDangerZone_project } from './__generated__/ProjectDangerZone_project.graphql'

type Props = {
    project: ProjectDangerZone_project
}

const ProjectDangerZone = ({ project }: Props) => [
    <View style={styles.header} key="header">
        <H3 style={styles.headerText}>Danger Zone</H3>
    </View>,
    <View style={styles.section} key="delete-project">
        <View style={styles.info}>
            <Text style={styles.infoTitle}>Delete This Project</Text>
            <Text>Permanently remove {project.repoID} from BazR</Text>
        </View>
        <WarningButton size="small" style={styles.button}>
            Delete Project
        </WarningButton>
    </View>
]

export default createFragmentContainer(
    ProjectDangerZone,
    graphql`
        fragment ProjectDangerZone_project on Project {
            repoID
        }
    `
)
