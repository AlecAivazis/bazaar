// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { withRouter } from 'react-router-dom'
// local imports
import type { ProjectSettings_project } from './__generated__/ProjectSettings_project.graphql'

type Props = {
    project: ProjectSettings_project
}

const ProjectSettings = ({ project }: Props) => <div>{project.repoID} settings</div>

export default withRouter(
    createFragmentContainer(
        ProjectSettings,
        graphql`
            fragment ProjectSettings_project on Project {
                repoID
            }
        `
    )
)
