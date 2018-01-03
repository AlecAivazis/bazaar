// external imports
import React from 'react'
import { View } from 'react-native-web'
import { IconCommand, IconBriefcase, IconSettings, FlexColumn, Text } from 'quark-web'
import { withRouter } from 'react-router-dom'
import { graphql } from 'react-relay'
// local imports
import styles from './styles'
import Logo from './Logo'
import NavLink from './NavLink'
import { QueryRenderer } from '~/client/components'

const AppBar = ({ location: { pathname } }) => {
    // we need to compute which button to highlight, default to the projects
    const view =
        {
            funds: 'funds',
            profile: 'profile'
            // default to the projects view
        }[pathname.split('/')[1]] || 'projects'

    return (
        <FlexColumn style={styles.container} justifyContent="space-between">
            <FlexColumn>
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
            </FlexColumn>
            <FlexColumn alignItems="center" style={styles.lowerIcons}>
                <NavLink to="/profile" match={view === 'profile'} style={styles.avatarContainer}>
                    <QueryRenderer
                        query={graphql`
                            query AppBarQuery {
                                viewer {
                                    avatarUrl
                                }
                            }
                        `}
                        render={({ viewer }) => <img style={styles.avatar} src={viewer.avatarUrl} />}
                    />
                </NavLink>
            </FlexColumn>
        </FlexColumn>
    )
}

export default withRouter(AppBar)
