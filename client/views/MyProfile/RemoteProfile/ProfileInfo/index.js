// external imports
import * as React from 'react'
import { FlexColumn, Text } from 'quark-web'
// local imports
import styles from './styles'

const ProfileInfo = ({ name, value }) => (
    <FlexColumn>
        <Text style={styles.name}>{name}</Text>
        <Text style={value ? styles.value : styles.hiddenValue}>{value || 'hidden'}</Text>
    </FlexColumn>
)

export default ProfileInfo
