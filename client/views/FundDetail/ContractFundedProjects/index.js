// external imports
import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { FlexColumn, H2, H3 } from 'quark-web'
// local imports
import FundedProjectRow from './FundedProjectRow'
import { ProjectName, ListRow } from '~/client/components'

const FundedProjects = ({ contract }) => {
    // filter the transactions to only withdrawls
    const withdrawls = contract.transactions.filter(({ __typename }) => __typename === 'ContractWithdrawl')

    return (
        <FlexColumn>
            <H2>Funded Projects</H2>
            {withdrawls.length === 0 ? (
                <H3>None!</H3>
            ) : (
                <React.Fragment>
                    {withdrawls.map(withdrawl => <FundedProjectRow project={withdrawl.project} />)}
                </React.Fragment>
            )}
        </FlexColumn>
    )
}

export default createFragmentContainer(
    FundedProjects,
    graphql`
        fragment ContractFundedProjects_contract on FundContract {
            transactions {
                __typename
                ... on ContractWithdrawl {
                    project {
                        ...FundedProjectRow_project
                    }
                }
            }
        }
    `
)
