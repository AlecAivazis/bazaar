// @flow
// external imports
import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { View } from 'react-native-web'
import { Text, H3, WarningButton } from 'quark-web'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
// local imports
import styles from './styles'
import type { ProjectDangerZone_project } from './__generated__/ProjectDangerZone_project.graphql'
import { deleteProject } from '../../../../mutations'

type Props = {
    project: ProjectDangerZone_project
}

const ProjectDangerZone = ({ project, relay, history }: Props, { accessToken }) => {
    // the repo owner and name
    const [owner, name] = project.repoID.split('/')
    return [
        <View style={styles.header} key="header">
            <H3 style={styles.headerText}>Danger Zone</H3>
        </View>,
        <View style={styles.section} key="delete-project">
            <View style={styles.info}>
                <Text style={styles.infoTitle}>Delete This Project</Text>
                <Text>Permanently remove {project.repoID} from BazR</Text>
            </View>
            <WarningButton
                size="small"
                style={styles.button}
                onClick={() =>
                    deleteProject({
                        environment: relay.environment,
                        input: { owner, name, accessToken },
                        onCompleted: (data, errs) => {
                            if (!errs) {
                                return history.push('/')
                            }

                            console.error(errs[0])
                        }
                    })
                }
            >
                Delete Project
            </WarningButton>
        </View>
    ]
}

ProjectDangerZone.contextTypes = {
    accessToken: PropTypes.string
}

export default withRouter(
    createFragmentContainer(
        ProjectDangerZone,
        graphql`
            fragment ProjectDangerZone_project on Project {
                repoID
            }
        `
    )
)
