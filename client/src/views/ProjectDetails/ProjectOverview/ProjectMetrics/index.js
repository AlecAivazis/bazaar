// @flow
// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { View, Text } from 'react-native-web'
// local imports
import type { ProjectMetrics_project } from './__generated__/ProjectMetrics_project.graphql'
import type { ProjectMetrics_repository } from './__generated__/ProjectMetrics_repository.graphql'
import { RepositoryOpenIssues } from '../../../../components'
import Metric from './Metric'
import styles from './styles'

type Props = {
    project: ProjectMetrics_project,
    repository: ProjectMetrics_repository
}

const ProjectMetrics = ({ project, repository }: Props) => (
    <View style={styles.container}>
        <RepositoryOpenIssues repository={repository}>
            {numIssues => (
                <Metric
                    value={numIssues}
                    label="pending issues"
                    icon={<Text>i</Text>}
                    style={{ ...styles.metric, ...styles.metricPadding }}
                />
            )}
        </RepositoryOpenIssues>
        <Metric
            value={project.totalEarned}
            label="ETH earned"
            icon={<Text>Ξ</Text>}
            style={{ ...styles.metric, ...styles.metricPadding }}
        />
        <Metric
            value={project.contributors.count || 0}
            label="Contributors"
            icon={<Text>C</Text>}
            style={styles.metric}
        />
    </View>
)

export default createFragmentContainer(ProjectMetrics, {
    project: graphql`
        fragment ProjectMetrics_project on Project {
            totalEarned
            contributors {
                count
            }
        }
    `,
    repository: graphql`
        fragment ProjectMetrics_repository on Repository {
            ...OpenIssues_repository
        }
    `
})
