// external imports
import React from 'react'
import { graphql } from 'react-relay'
import { withRouter } from 'react-router-dom'
// local imports
import { QueryRenderer } from '../../components'
import Content from './ProjectDetailsContent'

const ProjectDetails = ({ match: { params: { owner, name } } }) => (
    <QueryRenderer
        variables={{ id: `${owner}/${name}` }}
        query={graphql`
            query ProjectDetailsQuery($id: ID!) {
                project(repoID: $id) {
                    ...ProjectDetailsContent_project
                }
            }
        `}
        render={props => <Content {...props} />}
    />
)

export default withRouter(ProjectDetails)
