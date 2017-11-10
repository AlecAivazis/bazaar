// external imports
import React from 'react'
import { View, Text } from 'react-native-web'
// local imports
import styles from './styles'

const ProjectRow = ({ style }) => (
    <View style={[styles.container, style]}>
        <Text>hello</Text>
    </View>
)

export default ProjectRow
