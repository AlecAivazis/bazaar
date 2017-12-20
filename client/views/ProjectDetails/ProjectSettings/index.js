// @flow
// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { withRouter } from 'react-router-dom'
// local imports
import type { ProjectSettings_project } from './__generated__/ProjectSettings_project.graphql'
import UserSummary from './ProjectUserSummary'
import DangerZone from './ProjectDangerZone'
import styles from './styles'

type Props = {
    project: ProjectSettings_project
}

const ProjectSettings = ({ project }: Props) => [
    <UserSummary project={project} key="contributors" lastElementStyle={styles.sectionSpacing} />,
    <DangerZone project={project} key="danger" />
]

export default withRouter(
    createFragmentContainer(
        ProjectSettings,
        graphql`
            fragment ProjectSettings_project on Project {
                repoID
                ...ProjectUserSummary_project
                ...ProjectDangerZone_project
            }
        `
    )
)
