// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { withRouter } from 'react-router-dom'
// local imports
import type { ProjectOverview_project } from './__generated__/ProjectOverview_project.graphql'

type Props = {
    project: ProjectOverview_project
}

const ProjectOverview = ({ project }: Props) => <div>{project.repoID} overview</div>

export default withRouter(
    createFragmentContainer(
        ProjectOverview,
        graphql`
            fragment ProjectOverview_project on Project {
                repoID
            }
        `
    )
)
