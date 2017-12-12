// @flow
// external imports
import React from 'react'
import { View } from 'react-native-web'
import { createFragmentContainer, graphql } from 'react-relay'
import type { RelayProp } from 'react-relay'
import { H3, Text, Subtitle } from 'quark-web'
import moment from 'moment'
// local imports
import styles from './styles'
import type { ProjectUserSummary_project } from './__generated__/ProjectUserSummary_project.graphql'

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
        </View>,
        ...project.members.edges.map((edge, i) => {
            // guards
            if (!edge || !edge.node || !edge.node.user || !edge.node.user.profile || !project.members.edges) {
                console.warn('ProjectUserSummary: Could not connect to github.')
                return null
            }

            // check if we need to add extra styling
            const extraStyle = i === project.members.edges.length - 1 ? lastElementStyle : {}

            // grab the user and their from the node
            const { user, firstTransaction, lastTransaction, totalAmountEarned } = edge.node

            // the date the first transaction occured
            const firstStamp = moment(firstTransaction.edges[0].node.created_at)
            const lastStamp = moment(lastTransaction.edges[0].node.created_at_)
            // the format string for dates
            const format = 'll'

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
            const { name, avatarUrl } = user.profile

            return (
                <View key={user.id} style={{ ...styles.userRow, ...extraStyle }}>
                    <View style={styles.avatarContainer}>
                        <img src={avatarUrl} style={styles.avatar} />
                    </View>
                    <View>
                        <Text>{name}</Text>
                        <View style={styles.metaData}>
                            <Subtitle style={styles.metaDataText}>Total amount earned: {totalAmountEarned} Ξ</Subtitle>
                            <Subtitle style={styles.metaDataText}>
                                Latest contribution: {lastStamp.format(format)}
                            </Subtitle>
                            <Subtitle style={styles.metaDataText}>
                                First contribution: {firstStamp.format(format)}
                            </Subtitle>
                        </View>
                    </View>
                </View>
            )
        })
    ]
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
                        totalAmountEarned
                        firstTransaction: transactions(first: 1) {
                            edges {
                                node {
                                    created_at
                                }
                            }
                        }
                        lastTransaction: transactions(last: 1) {
                            edges {
                                node {
                                    created_at
                                }
                            }
                        }
                        user {
                            id
                            accountName
                            profile {
                                avatarUrl
                                name
                            }
                        }
                    }
                }
            }
        }
    `
)
