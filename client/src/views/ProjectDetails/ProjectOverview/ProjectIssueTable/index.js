// @flow
// external imports
import React from 'react'
import { View } from 'react-native-web'
import { createFragmentContainer, graphql } from 'react-relay'
import { Title } from 'quark-web'
// local imports
import styles from './styles'
import type { ProjectIssueTable_repository } from './__generated__/ProjectIssueTable_repository.graphql'
import TableRow from './ProjectIssueTableRow'

type Props = {
    repository: ProjectIssueTable_repository,
    style: any
}

const ProjectIssueTable = ({ repository, style }: Props) => {
    // guards
    if (!repository.issues || !repository.issues.edges) {
        throw new Error('Cannot find issues in the repository')
    }

    // sort the issues by
    const issues = repository.issues.edges
        .filter(edge => edge && edge.node)
        .map(edge => edge && edge.node)
        .sort((a, b) => {
            // the reactions in a
            const aReactions = a ? a.reactions.totalCount : 0
            const bReactions = b ? b.reactions.totalCount : 0

            return bReactions - aReactions
        })

    // guards
    return (
        <View style={{ ...styles.container, ...style }}>
            <View>
                <Title style={styles.header}>Open Issues ({repository.issues.totalCount})</Title>
            </View>
            <View style={styles.issueRowContainer}>
                {issues.map(issue => issue && <TableRow issue={issue} key={issue.id} />)}
            </View>
        </View>
    )
}

export default createFragmentContainer(
    ProjectIssueTable,
    graphql`
        fragment ProjectIssueTable_repository on Repository {
            issues(states: [OPEN], first: 10) {
                totalCount
                edges {
                    node {
                        id
                        reactions(first: 0, content: THUMBS_UP) {
                            totalCount
                        }
                        ...ProjectIssueTableRow_issue
                    }
                }
            }
        }
    `
)
