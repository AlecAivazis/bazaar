// @flow
// external imports
import * as React from 'react'
import { graphql } from 'react-relay'
import { H1, Subtitle } from 'quark-web'
// local imports
import { QueryRenderer } from '../../components'
import NewProjectRow from './NewProjectRow'
import type { NewProjectQueryResponse } from './__generated__/NewProjectQuery.graphql'
import styles from './styles'

const NewProjectView = () => (
    <QueryRenderer
        query={graphql`
            query NewProjectQuery {
                viewer {
                    repositories(first: 15, orderBy: { field: UPDATED_AT, direction: DESC }) {
                        edges {
                            node {
                                ...NewProjectRow_repo
                            }
                        }
                    }
                }
            }
        `}
        render={({ viewer: { repositories: { edges } } }: NewProjectQueryResponse) => (
            <div style={styles.container}>
                <H1 style={styles.header}>New Project</H1>
                <Subtitle style={styles.description}>
                    Select a project to begin collecting money for the hard work that’s taking place!
                </Subtitle>
                {edges &&
                    edges.map((edge, i) => {
                        // guards
                        if (!edge) {
                            return null
                        }

                        // render the project row
                        return <NewProjectRow repo={edge.node} first={i === 0} last={i === edges.length - 1} />
                    })}
            </div>
        )}
    />
)

export default NewProjectView
