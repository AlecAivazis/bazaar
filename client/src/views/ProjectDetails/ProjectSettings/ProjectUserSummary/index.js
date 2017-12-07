// @flow
// external imports
import React from 'react'
import { View } from 'react-native-web'
import { createFragmentContainer, graphql } from 'react-relay'
import type { RelayProp } from 'react-relay'
import { H3, Text, Select, Option } from 'quark-web'
// local imports
import styles from './styles'
import type { ProjectUserSummary_project } from './__generated__/ProjectUserSummary_project.graphql'
import { updateUserRole } from '../../../../mutations'

type Props = {
    project: ProjectUserSummary_project,
    lastElementStyle: {},
    relay: RelayProp
}

const ProjectUserSummary = ({ project, lastElementStyle, relay }: Props) => {
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
                    <Select
                        style={{ width: 200, paddingRight: 0 }}
                        value={role}
                        onChange={_changeRole({ project, user, relay, membership: edge.node })}
                    >
                        <Option value="ADMIN">Admin</Option>
                        <Option value="CONTRIBUTOR">Contributor</Option>
                    </Select>
                </View>
            )
        })
    ]
}

const _changeRole = ({
    relay,
    project,
    user,
    membership
}: {
    relay: RelayProp,
    project: { +id: string },
    user: { +id: string },
    membership: { +id: string }
}) => (role: string) => {
    updateUserRole({
        environment: relay.environment,
        input: {
            project: project.id,
            user: user.id,
            role
        },
        optimisticResponse: {
            UpdateUserRole: {
                membership: {
                    id: membership.id,
                    role
                }
            }
        }
    })
}

export default createFragmentContainer(
    ProjectUserSummary,
    graphql`
        fragment ProjectUserSummary_project on Project {
            id
            repoID
            members: contributors(first: 10) {
                edges {
                    node {
                        id
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
