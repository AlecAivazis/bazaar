// external imports
import React from 'react'
import { View } from 'react-native-web'
// local imports
import { Title, PrimaryButton } from '../../components'
import styles from './styles'

const Projects = () => (
    <View style={styles.container}>
        <View style={styles.header}>
            <Title>My Projects</Title>
            <PrimaryButton>Add Project</PrimaryButton>
        </View>
    </View>
)

export default Projects
