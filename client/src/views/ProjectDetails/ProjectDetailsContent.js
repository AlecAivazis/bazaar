// @flow
// external imports
import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { View } from 'react-native-web'
// local imports
import { Title } from '../../components'
import type { ProjectDetailsContent_project } from './__generated__/ProjectDetailsContent_project.graphql'

type Props = {
    project: ProjectDetailsContent_project
}

const ProjectDetailsContent = ({ project }: Props) => [
    <View key="header">
        <Title>
            {project.repository.owner.login} / {project.repository.name}
        </Title>
    </View>
]

export default createFragmentContainer(
    ProjectDetailsContent,
    graphql`
        fragment ProjectDetailsContent_project on Project {
            repository {
                name
                owner {
                    login
                }
            }
        }
    `
)
