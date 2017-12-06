// @flow
// external imports
import React from 'react'
import { View } from 'react-native-web'
import { createFragmentContainer, graphql } from 'react-relay'
import { H3, Text, Select, Option } from 'quark-web'
// local imports
import styles from './styles'
import type { ProjectUserSummary_project } from './__generated__/ProjectUserSummary_project.graphql'

type Props = {
    project: ProjectUserSummary_project,
    lastElementStyle: {}
}

const ProjectUserSummary = ({ project, lastElementStyle }: Props) => {
    // guards
    if (!project.members || !project.members.edges) {
        throw new Error(`Could not render user summary for project:${project.repoID}`)
    }

    return [
        <View style={styles.header} key="usersummary-header">
            <H3>Collaborators</H3>
        </View>,
        ...project.members.edges.map((edge, i) => {
            // guards
            if (!edge || !edge.node || !edge.node.user || !edge.node.user.profile) {
                console.warn('ProjectUserSummary: Could not connect to github.')
                return null
            }
            const { user, role } = edge.node
            // pull out the info we're gonna use from the edge
            const { name, login, avatarUrl } = user.profile

            // check if we need to add extra styling
            const extraStyle = i === project.members.edges.length - 1 ? lastElementStyle : {}

            return (
                <View key={user.id} style={{ ...styles.userRow, ...extraStyle }}>
                    <View style={styles.avatarContainer}>
                        <img src={avatarUrl} style={styles.avatar} />
                        <Text>{name}</Text>
                    </View>
                    <Select style={{ width: 200 }} value="asdf!" value={role}>
                        <Option value="admin">admin</Option>
                        <Option value="contributor">contributor</Option>
                    </Select>
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
                        user {
                            id
                            accountName
                            profile {
                                avatarUrl
                                login
                                name
                            }
                        }
                    }
                }
            }
        }
    `
)
