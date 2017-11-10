// external imports
import React from 'react'
import { View, Text } from 'react-native-web'
// local imports
import { Title, PrimaryButton } from '../../components'
import styles from './styles'
import ProjectRow from './ProjectRow'

const Projects = () => (
    <View style={styles.container}>
        <View style={styles.header}>
            <Title>My Projects</Title>
            <PrimaryButton>Add Project</PrimaryButton>
        </View>
        <View style={styles.content}>
            <ProjectRow />
            <ProjectRow />
            <ProjectRow style={styles.lastRow} />
        </View>
    </View>
)

export default Projects
