// external imports
import React from 'react'
import { Link } from 'react-router-dom'
import { View } from 'react-native-web'
// local imports
import styles from './styles'

const NavLink = ({ to, match, ...unused }) => (
    <View style={match ? styles.active : styles.inactive}>
        <Link to={to} {...unused} />
    </View>
)

export default NavLink
