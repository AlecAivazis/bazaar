// @flow
// external imports
import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { View, Text } from 'react-native-web'
import { Link } from 'react-router-dom'
import { BooleanState } from 'quark-core'
// local imports
import type { ProjectIssueTableRow_issue } from './__generated__/ProjectIssueTableRow_issue.graphql'
import styles from './styles'

type Props = {
    issue: ProjectIssueTableRow_issue
}

const ProjectIssueTableRow = ({ issue }: Props) => {
    // the number of votes that weight this issue is just the number of THUMBS_UP on the initial comment
    let nVotes
    // guards
    if (
        !issue ||
        !issue.comments.edges ||
        !issue.comments.edges[0] ||
        !issue.comments.edges[0].node ||
        !issue.comments.edges[0].node.reactions.edges
    ) {
        nVotes = 0
    } else {
        nVotes = issue.comments.edges[0].node.reactions.edges.length
    }

    return (
        <BooleanState>
            {({ state, set }) => (
                <a target="_blank" href={issue.url} onMouseEnter={() => set(true)} onMouseLeave={() => set(false)}>
                    <View style={[styles.issueRow, state && styles.hoverStyle]}>
                        <Text style={styles.issueTitle}>{issue.title}</Text>
                        <Text style={styles.votes}>{nVotes} Votes</Text>
                    </View>
                </a>
            )}
        </BooleanState>
    )
}
export default createFragmentContainer(
    ProjectIssueTableRow,
    graphql`
        fragment ProjectIssueTableRow_issue on Issue {
            title
            url
            comments(first: 1) {
                edges {
                    node {
                        reactions(first: 100, content: THUMBS_UP) {
                            edges {
                                node {
                                    id
                                }
                            }
                        }
                    }
                }
            }
        }
    `
)