// @flow
// external imports
import * as React from 'react'
import { View } from 'react-native-web'
import { H1, Label, Text, SecondaryButton, PrimaryButton, Form } from 'quark-web'
import { Overlay } from '~/client/quark'
import PropTypes from 'prop-types'
import { ConnectionHandler } from 'relay-runtime'
// local imports
import styles from './styles'
import { createFund } from '~/client/mutations'
import GetNameError from './GetNameError'
import CollectDepositError from './CollectDepositError'
import GetName from './GetName'
import CollectDeposit from './CollectDeposit'
import Finalize from './Finalize'

type Props = {
    toggle: boolean
}

type State = {
    step: 'getName' | 'collectDeposit' | 'completed',
    error: boolean,
    fund: ?{ [key: string]: string },
    deposit: ?number
}

class CreateFundOverlay extends React.Component<Props, State> {
    state = { step: 'getName' }

    static contextTypes = {
        environment: PropTypes.any
    }

    componentWillReceiveProps(nextProps) {
        // if we are toggling
        if (nextProps.visible !== this.props.visible) {
            this.setState({ step: 'getName', error: false })
        }
    }

    _next = () => {
        const step = do {
            if (this.state.step === 'getName') {
                ;('collectDeposit')
            } else {
                ;('completed')
            }
        }

        this.setState({ step, error: false })
    }

    _toggleError = () => this.setState(state => ({ error: !state.error }))

    _submit = ({ name, deposit }) => async () => {
        // grab the environment out of the context
        const { environment } = this.context

        try {
            // try to deploy a fund with the given name
            var { createFund: { node: fund } } = await createFund({
                environment,
                variables: { name }
            })
        } catch (error) {
            this.setState({ error: true })
            return console.error('error creating fund', error)
        }

        // make an initial deposit
        this.setState({
            fund,
            deposit,
            step: 'collectDeposit'
        })
    }

    render = () => {
        const { toggle, visible } = this.props
        return (
            <Overlay toggle={toggle} visible={visible}>
                <H1 style={styles.header}>Create a Fund</H1>
                {
                    do {
                        if (this.state.step === 'getName') {
                            if (this.state.error) {
                                ;<GetNameError toggle={this.props.toggle} toggleError={this._toggleError} />
                            } else {
                                ;<GetName toggle={this.props.toggle} submit={this._submit} />
                            }
                        } else if (this.state.step === 'collectDeposit') {
                            if (this.state.error) {
                                ;<CollectDepositError next={this._next} toggleError={this._toggleError} />
                            } else {
                                ;<CollectDeposit
                                    next={this._next}
                                    toggleError={this._toggleError}
                                    fund={this.state.fund}
                                    deposit={this.state.deposit}
                                />
                            }
                        } else {
                            ;<Finalize fund={this.state.fund} />
                        }
                    }
                }
            </Overlay>
        )
    }
}

export default CreateFundOverlay
