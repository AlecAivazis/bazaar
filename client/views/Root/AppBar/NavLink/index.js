// external imports
import React from 'react'
import { Link } from 'react-router-dom'
import { View } from 'react-native-web'
// local imports
import styles from './styles'

const NavLink = ({ to, match, style, ...unused }) => (
    <Link to={to} style={style}>
        <View style={match ? styles.active : styles.inactive} {...unused} />
    </Link>
)

export default NavLink
