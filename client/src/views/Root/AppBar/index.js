// external imports
import React from 'react'
import { View } from 'react-native-web'
// local imports
import styles from './styles'
import Logo from './Logo'
import NavIcon from './NavIcon'
import NavLink from './NavLink'

const AppBar = () => (
    <View style={styles.container}>
        <View style={styles.branding}>
            <Logo />
        </View>
        <NavLink to="/projects">
            <NavIcon name="code" />
        </NavLink>
        <NavLink to="/funds">
            <NavIcon name="money" />
        </NavLink>
        <NavLink to="/settings">
            <NavIcon name="gear" />
        </NavLink>
    </View>
)

export default AppBar
