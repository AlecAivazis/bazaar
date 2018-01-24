// external imports
import React from 'react'
import { graphql } from 'react-relay'
import { H1, FlexRow, PrimaryButton, BooleanState, Text } from 'quark-web'
import PropTypes from 'prop-types'
import web3 from 'web3'
// local imports
import { QueryRenderer } from '~/client/components'
import { DepositEtherOverlay } from '~/client/overlays'
import { promisify } from '~/client/schema/utils'
import Timeline from './TransactionTimeline'
import FundedProjects from './ContractFundedProjects'
import styles from './styles'

const FundDetail = ({ match: { params: { address } } }, { environment }) => (
    <QueryRenderer
        query={graphql`
            query FundDetailQuery($address: String!) {
                contract: fundContract(address: $address) {
                    __typename
                    ... on MinedFundContract {
                        address
                        fund {
                            name
                            ...DepositEtherOverlay_fund
                        }
                        ...TransactionTimeline_contract
                        ...ContractFundedProjects_contract
                    }
                }
            }
        `}
        variables={{ address }}
        render={({ contract }) =>
            contract.__typename !== 'MinedFundContract' ? (
                'fund not mined yet'
            ) : (
                <BooleanState>
                    {({ state, toggle }) => (
                        <React.Fragment>
                            <DepositEtherOverlay visible={state} toggle={toggle} fund={contract.fund} />
                            <FlexRow justifyContent="space-between" style={styles.header}>
                                <FlexRow alignItems="flex-end">
                                    <H1 style={styles.name}>{contract.fund.name}</H1>
                                    <Text style={styles.address}>{contract.address}</Text>
                                </FlexRow>
                                <PrimaryButton disabled={!environment} onPress={toggle}>
                                    Deposit Ether
                                </PrimaryButton>
                            </FlexRow>
                            <Timeline contract={contract} style={{ marginBottom: 28 }} />
                            <FundedProjects contract={contract} />
                        </React.Fragment>
                    )}
                </BooleanState>
            )
        }
    />
)

FundDetail.contextTypes = {
    environment: PropTypes.any
}

export default FundDetail
