// external imports
import React from 'react'
import { View } from 'react-native-web'
import { IconCommand, IconBriefcase, IconSettings } from 'quark-web'
import { withRouter } from 'react-router-dom'
// local imports
import styles from './styles'
import Logo from './Logo'
import NavLink from './NavLink'

const AppBar = ({ location: { pathname } }) => {
    // we need to compute which button to highlight, default to the projects
    const view =
        {
            '/funds': 'funds',
            '/settings': 'settings'
            // default to the projects view
        }[pathname] || 'projects'

    return (
        <View style={styles.container}>
            <View style={styles.branding}>
                <Logo />
            </View>
            {/* all projects are consider "under" this view so it should always be highlighted */}
            <NavLink to="/projects" match={view === 'projects'}>
                <IconCommand style={styles.icon} />
            </NavLink>
            <NavLink to="/funds" match={view === 'funds'}>
                <IconBriefcase style={styles.icon} />
            </NavLink>
            <NavLink to="/settings" match={view === 'settings'}>
                <IconSettings style={styles.icon} />
            </NavLink>
        </View>
    )
}

export default withRouter(AppBar)
