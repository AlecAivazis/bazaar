// @flow
// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { withRouter } from 'react-router-dom'
import { View, Text } from 'react-native-web'
// local imports
import type { ProjectOverview_project } from './__generated__/ProjectOverview_project.graphql'
import type { ProjectOverview_repository } from './__generated__/ProjectOverview_repository.graphql'
import Metric from './Metric'
import styles from './styles'
import { RepositoryOpenIssues } from '../../../components'

type Props = {
    project: ProjectOverview_project,
    repository: ProjectOverview_repository
}

const ProjectOverview = ({ project, repository }: Props) => (
    <View style={styles.container}>
        <View style={styles.metrics}>
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
                value={project.contributors.count}
                label="Contributors"
                icon={<Text>C</Text>}
                style={styles.metric}
            />
        </View>
    </View>
)

export default withRouter(
    createFragmentContainer(ProjectOverview, {
        project: graphql`
            fragment ProjectOverview_project on Project {
                repoID
                totalEarned
                contributors {
                    count
                }
            }
        `,
        repository: graphql`
            fragment ProjectOverview_repository on Repository {
                ...OpenIssues_repository
            }
        `
    })
)
