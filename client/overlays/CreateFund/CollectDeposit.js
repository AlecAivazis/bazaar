// @flow
// external imports
import React from 'react'
import { Text } from 'quark-web'
import PropTypes, { any } from 'prop-types'
// local imports
import { depositEther } from '~/client/mutations'
import styles from './styles'

type Props = {
    next: () => void,
    fund: { [key: string]: any },
    deposit: number,
    toggleError: () => void
}

class CollectDeposit extends React.Component<Props> {
    static contextTypes = {
        environment: PropTypes.any
    }

    async componentDidMount() {
        // deposit the designated amount to the new fund
        try {
            // try to deploy a fund with the given name
            await depositEther({
                environment: this.context.environment,
                input: {
                    address: this.props.fund.address,
                    amount: this.props.deposit
                }
            })

            // we're done here
            this.props.next()
        } catch (err) {
            console.error('error depositing ether', err)

            // we encountered error
            this.props.toggleError()
        }
    }

    render = () => <Text>Collecting initial deposit...</Text>
}

export default CollectDeposit
