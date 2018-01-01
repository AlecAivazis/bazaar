// external imports
import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { FlexRow, Text, H2 } from 'quark-web'
import moment from 'moment'
import BigNumber from 'bignumber.js'
// local imports
import { Timeseries, Chart, WeekAxis } from '~/client/components'
import styles from '../styles'

// the beginning of the week
const beginningOfWeek = moment().subtract(7, 'days')

const TransactionTimeline = ({ contract, style }) => {
    // the timeline shows an aggregation of amount per unit time
    const data = contract.transactions
        // massage the data into the expected types for the time series
        .map(({ time, balance, ...rest }) => ({
            ...rest,
            time: moment.unix(time),
            value: BigNumber(web3.utils.fromWei(balance, 'ether'))
        }))
        // only show the transactions in the last week
        .filter(({ time }) => time.isAfter(beginningOfWeek))

    // make sure the list is sorted in chronological order
    data.sort(({ time: time1 }, { time: time2 }) => (time1.isAfter(time2) ? 1 : -1))

    // compute the initial value
    const initialValue = do {
        const amount = web3.utils.fromWei(data[0].amount, 'ether')
        // if the first transaction was a deposit
        if (data[0].__typename === 'ContractDeposit') {
            // the balance before the transaction is less than its current value
            data[0].value.minus(amount)
            // the transaction was a withdrawl
        } else {
            // the balance before the transaction is great than its current value
            data[0].value.plus(amount)
        }
    }

    // render the timeline
    return (
        <React.Fragment>
            <FlexRow style={{ marginBottom: 16 }}>
                <Text style={styles.infoText}>
                    Current Balance: {web3.utils.fromWei(contract.balance, 'ether')} ether
                </Text>
            </FlexRow>
            <Chart style={style}>
                <Timeseries initialValue={initialValue} data={data} />
                <WeekAxis />
            </Chart>
        </React.Fragment>
    )
}

export default createFragmentContainer(
    TransactionTimeline,
    graphql`
        fragment TransactionTimeline_contract on FundContract {
            balance
            transactions {
                __typename
                ... on ContractDeposit {
                    balance
                    time
                    amount
                }
                ... on ContractWithdrawl {
                    balance
                    time
                    amount
                }
            }
        }
    `
)
