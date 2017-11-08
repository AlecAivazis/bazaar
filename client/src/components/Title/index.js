// external imports
import React from 'react'
import { Title as QuarkTitle } from 'quark-web'
// local imports
import styles from './styles'

const Title = ({ style, ...unused }) => <QuarkTitle style={[styles.container, style]} {...unused} />

export default Title
