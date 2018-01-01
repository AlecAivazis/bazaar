// external imports
import * as React from 'react'
import { View } from 'react-native-web'
import { Link } from 'react-router-dom'
import { H1, PrimaryButton, BooleanState } from 'quark-web'
import PropTypes from 'prop-types'
import { graphql } from 'react-relay'
// local imports
import styles from './styles'
import { QueryRenderer } from '~/client/components'
import { CreateFundOverlay } from '~/client/overlays'
import FundListRow from './FundListRow'

const FundList = (_, { environment }) => (
    <BooleanState>
        {({ state, toggle }) => (
            <React.Fragment>
                <View style={styles.header}>
                    <H1>My Funds</H1>
                    <PrimaryButton disabled={!environment} onPress={toggle}>
                        Create a Fund
                    </PrimaryButton>
                </View>
                <QueryRenderer
                    query={graphql`
                        query FundListQuery {
                            viewer {
                                ...CreateFundOverlay_viewer
                                funds(first: 100) @connection(key: "FundList_funds", filters: []) {
                                    edges {
                                        node {
                                            address
                                            ...FundListRow_fund
                                        }
                                    }
                                }
                            }
                        }
                    `}
                    render={({ viewer }) => (
                        <React.Fragment>
                            <CreateFundOverlay viewer={viewer} visible={state} toggle={toggle} />
                            {viewer.funds.edges.map(
                                ({ node: fund }, i) =>
                                    fund && (
                                        <FundListRow
                                            fund={fund}
                                            key={fund.address}
                                            last={i === viewer.funds.edges.length - 1}
                                        />
                                    )
                            )}
                        </React.Fragment>
                    )}
                />
            </React.Fragment>
        )}
    </BooleanState>
)

FundList.contextTypes = {
    environment: PropTypes.any
}

export default FundList
