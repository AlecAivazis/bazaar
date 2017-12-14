// external imports
import React from 'react'
import { View } from 'react-native-web'
import { graphql } from 'react-relay'
import { PrimaryButton, H1 } from 'quark-web'
import { Link } from 'react-router-dom'
// local imports
import { QueryRenderer } from '../../components'
import styles from './styles'
import ProjectRow from './ProjectRow'

const ProjectList = props => (
    <View style={styles.container}>
        <View style={styles.header}>
            <H1>My Projects</H1>
            <Link to="/projects/manage" style={{ width: 160 }}>
                <PrimaryButton>Manage Projects</PrimaryButton>
            </Link>
        </View>
        <View style={styles.content}>
            <QueryRenderer
                query={graphql`
                    query ProjectListQuery {
                        projects {
                            edges {
                                node {
                                    repoID
                                    ...ProjectRow_project
                                }
                            }
                        }
                    }
                `}
                render={({ projects }) => {
                    // we are done loading
                    return projects.edges.map(({ node: project }, i) => (
                        <ProjectRow
                            project={project}
                            key={project.repoID}
                            style={i === projects.edges.length - 1 && styles.lastRow}
                        />
                    ))
                }}
            />
        </View>
    </View>
)

export default ProjectList
