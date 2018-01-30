// @flow
// external imports
import * as React from 'react'
import { Overlay, Text, H1, Label, Input, PrimaryButton, FlexRow, Form } from 'quark-web'
import type { OverlayProps } from 'quark-web'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import { depositEther } from '~/client/mutations'

const _deposit = ({ amount, environment, fund, toggle }) => async () => {
    // deposit the specified amount of ether
    const receipt = await depositEther({
        environment,
        input: {
            address: fund.address,
            amount
        }
    })

    // close the overlay
    toggle()
}

type Props = {} & OverlayProps

const DepositEtherOverlay = ({ visible, toggle, fund, relay }: Props) => (
    <Form initialData={{ amount: '' }}>
        {({ getValue, setValue }) => (
            <Overlay visible={visible} toggle={toggle}>
                <H1>Deposit Ether</H1>
                <Label value={'Insert Amount'} style={{ marginBottom: 20 }}>
                    <Input autoFocus value={getValue('amount')} onChange={amount => setValue({ amount })} />
                </Label>
                <FlexRow justifyContent="flex-end">
                    <PrimaryButton
                        onPress={_deposit({
                            amount: getValue('amount'),
                            fund,
                            environment: relay.environment,
                            toggle
                        })}
                    >
                        Deposit
                    </PrimaryButton>
                </FlexRow>
            </Overlay>
        )}
    </Form>
)

export default createFragmentContainer(
    DepositEtherOverlay,
    graphql`
        fragment DepositEtherOverlay_fund on MinedFundContract {
            address
        }
    `
)
