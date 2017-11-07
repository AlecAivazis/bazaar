// external imports
import React from 'react'
import { App } from 'quark-web'
import { Switch, Route } from 'react-router-dom'
import { View } from 'react-native-web'
// local imports
import styles from './styles'
import AppBar from './AppBar'
import { Projects, Funds, Settings } from '..'

const Root = () => (
    <App style={styles.container}>
        <AppBar />
        <View style={styles.content}>
            <Switch>
                <Route path="/projects" component={Projects} />
                <Route path="/funds" component={Funds} />
                <Route path="/settings" component={Settings} />
            </Switch>
        </View>
    </App>
)

export default Root
