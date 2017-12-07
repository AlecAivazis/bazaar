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
            <H3>Role</H3>
        </View>,
        ...project.members.edges.map((edge, i) => {
            // guards
            if (!edge || !edge.node || !edge.node.user || !edge.node.user.profile || !project.members.edges) {
                console.warn('ProjectUserSummary: Could not connect to github.')
                return null
            }

            // check if we need to add extra styling
            const extraStyle = i === project.members.edges.length - 1 ? lastElementStyle : {}

            // grab the user and their role from the node
            const { user, role } = edge.node

            // if we can't access the profile
            if (!user.profile) {
                // display a friendly message
                return (
                    <View style={{ ...styles.userRow, ...extraStyle }}>
                        <Text>Could not access github for user with account name {user.accountName}</Text>
                    </View>
                )
            }

            // pull out the info we're gonna use from the edge
            const { name, login, avatarUrl } = user.profile

            return (
                <View key={user.id} style={{ ...styles.userRow, ...extraStyle }}>
                    <View style={styles.avatarContainer}>
                        <img src={avatarUrl} style={styles.avatar} />
                        <Text>{name}</Text>
                    </View>
                    <Select style={{ width: 200, paddingRight: 0 }} value={role}>
                        <Option value="admin">Admin</Option>
                        <Option value="contributor">Contributor</Option>
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
                        role
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