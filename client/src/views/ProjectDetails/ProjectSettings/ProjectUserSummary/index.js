// @flow
// external imports
import React from 'react'
import { View } from 'react-native-web'
import { createFragmentContainer, graphql } from 'react-relay'
import { H3, Text } from 'quark-web'
// local imports
import styles from './styles'
import type { ProjectUserSummary_project } from './__generated__/ProjectUserSummary_project.graphql'

type Props = {
    project: ProjectUserSummary_project
}

const ProjectUserSummary = ({ project }: Props) => {
    // guards
    if (!project.members || !project.members.edges) {
        throw new Error(`Could not render user summary for project:${project.repoID}`)
    }

    return [
        <View style={styles.header} key="usersummary-header">
            <H3>Collaborators</H3>
        </View>,
        ...project.members.edges.map(edge => {
            // guards
            if (!edge || !edge.node || !edge.node.profile) {
                console.warn('ProjectUserSummary: Could not connect to github.')
                return null
            }

            // pull out the info we're gonna use from the edge
            const { name, login } = edge.node.profile
            return (
                <View key={login} style={styles.userRow}>
                    <Text>{name}</Text>
                </View>
            )
        })
    ]
}

export default createFragmentContainer(
    ProjectUserSummary,
    graphql`
        fragment ProjectUserSummary_project on Project {
            repoID
            members: contributors(first: 10) {
                edges {
                    node {
                        accountName
                        profile {
                            login
                            name
                        }
                    }
                }
            }
        }
    `
)
