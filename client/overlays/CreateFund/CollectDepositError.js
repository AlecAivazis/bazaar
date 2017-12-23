// @flow
// external imports
import React from 'react'
import { Text, SecondaryButton, PrimaryButton } from 'quark-web'
import { View } from 'react-native-web'
// local imports
import styles from './styles'

type Props = {
    next: () => void,
    toggleError: () => void
}

export default ({ next, toggleError }: Props) => (
    <React.Fragment>
        <Text>Something went wrong while collecting deposit</Text>
        <View style={styles.footer}>
            <SecondaryButton onPress={toggleError}>Try Again</SecondaryButton>
            <PrimaryButton onPress={next}>Continue</PrimaryButton>
        </View>
    </React.Fragment>
)
