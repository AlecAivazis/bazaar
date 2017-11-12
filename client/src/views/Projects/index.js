// external imports
import React from 'react'
import { View, Text } from 'react-native-web'
import { QueryRenderer, graphql } from 'react-relay'
import PropTypes from 'prop-types'
// local imports
import { Title, PrimaryButton } from '../../components'
import styles from './styles'
import ProjectRow from './ProjectRow'

const Projects = (props, { environment }) => (
    <View style={styles.container}>
        <View style={styles.header}>
            <Title>My Projects</Title>
            <PrimaryButton>Add Project</PrimaryButton>
        </View>
        <View style={styles.content}>
            {!environment ? (
                <Text>loading</Text>
            ) : (
                <QueryRenderer
                    environment={environment}
                    query={graphql`
                        query ProjectsQuery {
                            projects {
                                repoID
                                ...ProjectRow_project
                            }
                        }
                    `}
                    render={({ error, props }) => {
                        // if something went wrong
                        if (error) {
                            // render the nearest error boundary
                            throw new Error(error)
                        }
                        // if we are still loading
                        if (!props) {
                            return <Text>loading</Text>
                        }

                        // we are done loading
                        return props.projects.map((project, i) => (
                            <ProjectRow
                                project={project}
                                key={project.repoID}
                                style={i === props.projects.length - 1 && styles.lastRow}
                            />
                        ))
                    }}
                />
            )}
        </View>
    </View>
)

Projects.contextTypes = {
    environment: PropTypes.object
}

export default Projects
