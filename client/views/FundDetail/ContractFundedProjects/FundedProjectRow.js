// external imports
import * as React from 'react'
import { H3 } from 'quark-web'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import { ListRow, ProjectName } from '~/client/components'

const FundedProjectRow = ({ project }) => (
    <ListRow>
        <H3>
            <ProjectName project={withdrawl.project} />
        </H3>
    </ListRow>
)

export default createFragmentContainer(
    FundedProjectRow,
    graphql`
        fragment FundedProjectRow_project on Project {
            ...ProjectName_project
        }
    `
)
