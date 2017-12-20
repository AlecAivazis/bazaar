// external imports
import * as React from 'react'
import { View } from 'react-native-web'
import { Link } from 'react-router-dom'
import { H1, PrimaryButton } from 'quark-web'
import PropTypes from 'prop-types'
import { graphql } from 'react-relay'
// local imports
import styles from './styles'
import { createFund } from '../../mutations'
import { QueryRenderer } from '../../components'
import FundListRow from './FundListRow'

const FundList = (_, { environment }) => (
    <React.Fragment>
        <View style={styles.header}>
            <H1>My Funds</H1>
            <Link to="/funds/new" style={{ width: 160 }}>
                <PrimaryButton onClick={environment && (() => createFund({ environment, input: { name: 'foo' } }))}>
                    Create a Fund
                </PrimaryButton>
            </Link>
        </View>
        <QueryRenderer
            query={graphql`
                query FundListQuery {
                    funds {
                        ...FundListRow_fund
                    }
                }
            `}
            render={({ funds }) => funds.map((fund, i) => <FundListRow fund={fund} last={i === funds.length - 1} />)}
        />
    </React.Fragment>
)

FundList.contextTypes = {
    environment: PropTypes.any
}

export default FundList
