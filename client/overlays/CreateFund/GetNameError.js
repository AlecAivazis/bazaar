// @flow
// external imports
import React from 'react'
import { Text, SecondaryButton, PrimaryButton } from 'quark-web'
import { View } from 'react-native-web'
// local imports
import styles from './styles'

type Props = {
    toggle: () => void,
    toggleError: () => void
}

export default ({ toggle, toggleError }: Props) => (
    <React.Fragment>
        <Text>Something went wrong while creating fund</Text>
        <View style={styles.footer}>
            <SecondaryButton onPress={toggle}>Cancel</SecondaryButton>
            <PrimaryButton onPress={toggleError}>Try Again</PrimaryButton>
        </View>
    </React.Fragment>
)
