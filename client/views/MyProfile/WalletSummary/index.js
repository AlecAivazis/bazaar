// external imports
import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { FlexColumn, Input, Label, Form, PrimaryButton } from 'quark-web'
import web3 from 'web3'
// local imports
import styles from './styles'
import { updateUser } from '~/client/mutations'

const _updateWalletAddress = ({ value: walletAddress, viewer, environment, setValue }) => async () => {
    // update the remote wallet address
    await updateUser({
        environment,
        input: { id: viewer.bazrUser.id, walletAddress }
    })

    // hide the button
    setValue({ changed: false })
}

const WalletSummary = ({ viewer, relay }) => {
    // the old value of the user's wallet
    const address = viewer.bazrUser.walletAddress

    // render the input
    return (
        <Form
            value={{ value: address }}
            validate={{
                value: val => (web3.utils.isAddress(val) ? null : 'Must be a valid wallet address')
            }}
        >
            {({ getValue, setValue, hasErrors, getError }) => (
                <FlexColumn>
                    <Label value="Wallet Address" error={getError('value')}>
                        <Input
                            placeholder="0x7F6DC3161d6746b44C48F087E1bE671dA2A41b8b"
                            value={getValue('value')}
                            onChange={value => setValue({ changed: true, value })}
                        />
                    </Label>
                    {getValue('changed') &&
                        getValue('value') !== address && (
                            <PrimaryButton
                                onPress={_updateWalletAddress({
                                    viewer,
                                    environment: relay.environment,
                                    value: getValue('value'),
                                    setValue
                                })}
                                style={styles.button}
                                disabled={hasErrors}
                            >
                                Update Address
                            </PrimaryButton>
                        )}
                </FlexColumn>
            )}
        </Form>
    )
}

export default createFragmentContainer(
    WalletSummary,
    graphql`
        fragment WalletSummary_viewer on User {
            id
            bazrUser {
                id
                walletAddress
            }
        }
    `
)
