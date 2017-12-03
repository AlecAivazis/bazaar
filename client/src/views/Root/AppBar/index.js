// external imports
import React from 'react'
import { View } from 'react-native-web'
import { IconCommand, IconBriefcase, IconSettings } from 'quark-web'
// local imports
import styles from './styles'
import Logo from './Logo'
import NavLink from './NavLink'

const AppBar = () => (
    <View style={styles.container}>
        <View style={styles.branding}>
            <Logo />
        </View>
        <NavLink to="/projects">
            <IconCommand style={styles.icon} />
        </NavLink>
        <NavLink to="/funds">
            <IconBriefcase style={styles.icon} />
        </NavLink>
        <NavLink to="/settings">
            <IconSettings style={styles.icon} />
        </NavLink>
    </View>
)

export default AppBar
