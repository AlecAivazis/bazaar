// @flow
// external imports
import type { Node } from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
// local imports
import type { Name_project } from './__generated__/Name_project.graphql'

const ProjectName = ({ project }) => `${repository.owner.login} / ${repository.name}`

export default createFragmentContainer(
    ProjectName,
    graphql`
        fragment ProjectName_project on Project {
            repository {
                name
                owner {
                    login
                }
            }
        }
    `
)
