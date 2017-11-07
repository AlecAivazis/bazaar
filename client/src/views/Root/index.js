// external imports
import React from 'react'
import { App } from 'quark-web'
// local imports
import styles from './styles'
import AppBar from './AppBar'

const Root = () => (
    <App style={styles.container}>
        <AppBar />
        <div style={styles.content}>hello</div>
    </App>
)

export default Root
