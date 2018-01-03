// external imports
import React from 'react'
import { App } from 'quark-web'
import { Switch, Route, Redirect } from 'react-router-dom'
import { View } from 'react-native-web'
// local imports
import './reset.css'
import styles from './styles'
import AppBar from './AppBar'
import { ProjectList, ProjectDetails, FundList, FundDetail, MyProfile, Graphiql, ManageProjects } from '..'

const Root = ({ githubToken }) => (
    <App style={styles.container}>
        <AppBar />
        <View style={styles.content}>
            <Switch>
                <Route
                    path="/"
                    exact
                    render={matchProps => <Redirect to={`/projects${matchProps.location.search}`} />}
                />
                <Route exact path="/projects/register" component={ManageProjects} />
                <Route exact path="/projects" component={ProjectList} />
                <Route path="/funds/:address" component={FundDetail} />
                <Route exact path="/funds" component={FundList} />
                <Route path="/profile" component={MyProfile} />
                <Route path="/:owner/:name" component={ProjectDetails} />
                <Route path="/graphiql" render={() => <Graphiql githubToken={githubToken} />} />
            </Switch>
        </View>
    </App>
)

export default Root
