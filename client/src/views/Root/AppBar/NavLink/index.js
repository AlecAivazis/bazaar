// external imports
import React from 'react'
import { Link, Route } from 'react-router-dom'
import { View } from 'react-native-web'
// local imports
import styles from './styles'

const BazrLink = ({ to, ...unused }) => (
    <Route path={to}>
        {({ match }) => (
            <View style={match ? styles.active : styles.inactive}>
                <Link to={to} {...unused} />
            </View>
        )}
    </Route>
)

export default BazrLink
