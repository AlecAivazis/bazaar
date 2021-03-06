// @flow
// external imports
import * as React from 'react'
import { graphql } from 'react-relay'
import { H1, Subtitle } from 'quark-web'
// local imports
import { QueryRenderer } from '../../components'
import ManageProjectsRow from './ManageProjectsRow'
import type { ManageProjectsQueryResponse } from './__generated__/ManageProjectsQuery.graphql'
import styles from './styles'

const ManageProjectsView = () => (
    <QueryRenderer
        query={graphql`
            query ManageProjectsQuery {
                viewer {
                    repositories(first: 25, orderBy: { field: UPDATED_AT, direction: DESC }) {
                        edges {
                            node {
                                id
                                ...ManageProjectsRow_repo
                            }
                        }
                    }
                }
            }
        `}
        render={({ viewer: { repositories: { edges } } }: ManageProjectsQueryResponse) => (
            <div style={styles.container}>
                <H1 style={styles.header}>Register a Project</H1>
                <Subtitle style={styles.description}>
                    Connect a project to begin collecting money for the hard work that’s taking place!
                </Subtitle>
                {edges &&
                    edges.map((edge, i) => {
                        // guards
                        if (!edge) {
                            return null
                        }

                        // render the project row
                        return <ManageProjectsRow key={edge.node.id} repo={edge.node} last={i === edges.length - 1} />
                    })}
            </div>
        )}
    />
)

export default ManageProjectsView
