// @flow
// external imports
import React from 'react'
import { View, Text } from 'react-native-web'
import { createFragmentContainer, graphql } from 'react-relay'
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

    // guards
    return (
        <View style={{ ...styles.container, ...style }}>
            <View>
                <Text style={styles.header}>Open Issues ({repository.issues.totalCount})</Text>
            </View>
            <View style={styles.issueRowContainer}>
                {repository.issues.edges.map(edge => edge && edge.node && <TableRow issue={edge.node} />)}
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
                        ...ProjectIssueTableRow_issue
                    }
                }
            }
        }
    `
)
