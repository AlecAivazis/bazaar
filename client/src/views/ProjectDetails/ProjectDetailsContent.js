// @flow
// external imports
import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { View, Text } from 'react-native-web'
import { Switch, Route, Redirect, NavLink, withRouter } from 'react-router-dom'
import { H1 } from 'quark-web'
import { link } from 'quark-web/styles'
// local imports
import styles from './styles'
import Overview from './ProjectOverview'
import Settings from './ProjectSettings'
import type { ProjectDetailsContent_project } from './__generated__/ProjectDetailsContent_project.graphql'

type Props = {
    project: ProjectDetailsContent_project
}

const ProjectDetailsContent = ({ project }: Props) => {
    // if there is no owner
    if (!project.repository || !project.repository.owner) {
        throw new Error('Cannot find repository associated with ' + project.repoID)
    }

    // the base urld
    const url = `/${project.repository.owner.login}/${project.repository.name}`
    return [
        <View key="header" style={styles.header}>
            <H1 style={{ marginBottom: 0 }}>
                {project.repository.owner.login} / {project.repository.name}
            </H1>
            <View style={styles.links}>
                <NavLink
                    style={{ ...link, fontSize: 16, marginRight: 16 }}
                    activeStyle={styles.linkActive}
                    to={`${url}/overview`}
                >
                    <Text style={styles.linkText}>overview</Text>
                </NavLink>
                <NavLink style={{ ...link, fontSize: 16 }} activeStyle={styles.linkActive} to={`${url}/settings`}>
                    <Text style={styles.linkText}>settings</Text>
                </NavLink>
            </View>
        </View>,
        <Switch key="routes">
            <Route
                path={`${url}/overview`}
                render={match => <Overview project={project} repository={project.repository} {...match} />}
            />
            <Route path={`${url}/settings`} render={match => <Settings project={project} {...match} />} />
            <Route render={() => <Redirect to={`${url}/overview`} />} />
        </Switch>
    ]
}

export default withRouter(
    createFragmentContainer(
        ProjectDetailsContent,
        graphql`
            fragment ProjectDetailsContent_project on Project {
                repoID
                repository {
                    name
                    owner {
                        login
                    }
                    ...ProjectOverview_repository
                }
                ...ProjectOverview_project
                ...ProjectSettings_project
            }
        `
    )
)
