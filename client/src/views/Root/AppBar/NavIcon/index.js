// external imports
import React from 'react'
import { View } from 'react-native-web'
// local imports
import { Icon } from '../../../../components'
import styles from './styles'

const NavIcon = ({ ...unused }) => (
    <View style={styles.container}>
        <Icon {...styles.navIcon} {...unused} />
    </View>
)

export default NavIcon
