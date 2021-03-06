// @flow
// external imports
import type { Node } from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
// local imports
import type { OpenIssues_repository } from './__generated__/OpenIssues_repository.graphql'

type Props = {
    repository: OpenIssues_repository,
    children: number => Node
}

const OpenIssues = ({ repository, children }: Props) => children(repository.openIssues.totalCount)

export default createFragmentContainer(
    OpenIssues,
    graphql`
        fragment OpenIssues_repository on Repository {
            openIssues: issues(states: [OPEN], first: 10) {
                totalCount
            }
        }
    `
)
