// @flow
// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { withRouter } from 'react-router-dom'
import { View } from 'react-native-web'
// local imports
import Metrics from './ProjectMetrics'
import Issues from './ProjectIssueTable'
import styles from './styles'
import type { ProjectOverview_project } from './__generated__/ProjectOverview_project.graphql'
import type { ProjectOverview_repository } from './__generated__/ProjectOverview_repository.graphql'

type Props = {
    project: ProjectOverview_project,
    repository: ProjectOverview_repository
}

const ProjectOverview = ({ project, repository }: Props) => (
    <View style={styles.container}>
        <Metrics project={project} repository={repository} style={styles.metrics} />
        <Issues repository={repository} />
    </View>
)

export default withRouter(
    createFragmentContainer(ProjectOverview, {
        project: graphql`
            fragment ProjectOverview_project on Project {
                repoID
                ...ProjectMetrics_project
            }
        `,
        repository: graphql`
            fragment ProjectOverview_repository on Repository {
                ...ProjectMetrics_repository
                ...ProjectIssueTable_repository
            }
        `
    })
)
