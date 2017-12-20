// @flow
// external imports
import * as React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { H2, Subtitle, IconStar } from 'quark-web'
import { View } from 'react-native-web'
// local imports
import { ListRow } from '../../components'
import styles from './styles'
import FundListRow_fund from './__generated__/FundListRow_fund.graphql'

type Props = {
    fund: FundListRow_fund,
    last: Boolean
}

const FundListRow = ({ fund, last }: Props) => (
    <ListRow style={styles.row} last={last}>
        <H2 style={styles.fundName}>
            {fund.name}
            <Subtitle style={styles.address}>{fund.contract.address}</Subtitle>
        </H2>
        <View style={styles.statsRow}>
            <View style={styles.starContainer}>
                <Subtitle style={styles.stat}>Javascript &middot; more than 100</Subtitle>
                <Subtitle style={{ ...styles.stat, marginLeft: 2 }}>
                    {' '}
                    <IconStar />
                </Subtitle>
                <Subtitle style={{ ...styles.stat, marginLeft: 2 }}>&middot; less than 500</Subtitle>
                <Subtitle style={{ ...styles.stat, marginLeft: 2 }}>
                    {' '}
                    <IconStar />
                </Subtitle>
            </View>
            <Subtitle style={styles.stat}>
                Ether Remaining: {window.web3.fromWei(fund.contract.balance, 'ether').toString()}
            </Subtitle>
        </View>
    </ListRow>
)

export default createFragmentContainer(
    FundListRow,
    graphql`
        fragment FundListRow_fund on Fund {
            name
            contract {
                address
                balance
            }
        }
    `
)
