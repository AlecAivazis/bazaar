// external imports
import React from 'react'
import { Form, Label, Text, PrimaryButton, SecondaryButton } from 'quark-web'
import { Input } from '~/client/quark'
import { View } from 'react-native-web'
// local imports
import styles from './styles'

export default ({ toggle, submit }) => (
    <Form
        initialData={{ name: '' }}
        validate={{
            name: val => ((val && val.length) > 0 ? null : 'name is required'),
            deposit: val => ((val && val.length) > 0 ? null : 'deposit is required')
        }}
    >
        {({ getValue, setValue, getError, hasErrors }) => (
            <React.Fragment>
                <Label value="Name" style={styles.input} error={getError('name')}>
                    <Input error={getError('name')} value={getValue('name')} onChange={name => setValue({ name })} />
                </Label>
                <Label value="Initial Deposit" error={getError('name')}>
                    <Input
                        error={getError('deposit')}
                        value={getValue('deposit')}
                        onChange={deposit => setValue({ deposit })}
                    />
                </Label>
                <View style={styles.footer}>
                    <SecondaryButton onPress={toggle}>Cancel</SecondaryButton>
                    <PrimaryButton
                        style={styles.submitButton}
                        disabled={hasErrors}
                        onPress={submit({
                            name: getValue('name'),
                            deposit: getValue('deposit')
                        })}
                    >
                        Deposit Ether
                    </PrimaryButton>
                </View>
            </React.Fragment>
        )}
    </Form>
)
