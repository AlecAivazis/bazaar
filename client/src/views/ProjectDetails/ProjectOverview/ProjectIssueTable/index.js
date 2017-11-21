// @flow
// external imports
import React from 'react'
import { View } from 'react-native-web'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import styles from './styles'
import type { ProjectIssueTable_repository } from './__generated__/ProjectIssueTable_repository.graphql'

type Props = {
    repository: ProjectIssueTable_repository,
    style: any
}

const ProjectIssueTable = ({ repository, style }: Props) => {
    // guards
    if (!repository.issues || !repository.issues.edges) {
        throw new Error('Cannot find issues in the repository')
    }
    return (
        <View style={{ ...styles.container, ...style }}>
            <View style={styles.header}>Open Issues ({repository.issues.totalCount})</View>
            <View style={styles.issueRows}>
                {repository.issues.edges.map(({ node: issue }) => issue && <View>{issue.title}</View>)}
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
                        title
                    }
                }
            }
        }
    `
)
