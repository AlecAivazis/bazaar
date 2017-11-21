// external imports
import React from 'react'
import { App } from 'quark-web'
import { Switch, Route, Redirect } from 'react-router-dom'
import { View } from 'react-native-web'
// local imports
import styles from './styles'
import AppBar from './AppBar'
import { ProjectList, ProjectDetails, Funds, Settings, Graphiql } from '..'

const Root = () => (
    <App style={styles.container}>
        <AppBar />
        <View style={styles.content}>
            <Switch>
                <Route path="/" exact render={() => <Redirect to="/projects" />} />
                <Route path="/projects" component={ProjectList} />
                <Route path="/funds" component={Funds} />
                <Route path="/settings" component={Settings} />
                <Route path="/:owner/:name" component={ProjectDetails} />
                <Route path="/graphiql" component={Graphiql} />
            </Switch>
        </View>
    </App>
)

export default Root
