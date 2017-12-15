// @flow
// external imports
import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { Title, Text, IconCheckCircle } from 'quark-web'
import PropTypes from 'prop-types'
// local imports
import ConnectCTA from './ConnectCTA'
import type { ManageProjectsRow_repo } from './__generated__/ManageProjectsRow_repo.graphql'
import styles from './styles'

type Props = {
    repo: ManageProjectsRow_repo,
    first: boolean,
    last: boolean
}

type ContextTypes = {
    accessToken: ?string
}

// the connected indicator
export const ConnectedIndicator = () => (
    <div style={{ display: 'flex', color: '#58AD66', flexDirection: 'row', alignItems: 'center' }}>
        <IconCheckCircle />
        <Text style={{ marginLeft: 4, color: '#58AD66' }}>connected</Text>
    </div>
)

const ManageProjectsRow = ({ repo, first, relay }: Props, { accessToken }: ContextTypes) => (
    <div style={first ? styles.firstRepoRow : styles.repoRow}>
        <Title style={{ display: 'flex', alignItems: 'center', fontWeight: '100' }}>
            {repo.owner.login} / {repo.name}
        </Title>
        {repo.bazrProject ? (
            <ConnectedIndicator />
        ) : (
            <ConnectCTA environment={relay.environment} repo={repo} accessToken={accessToken} />
        )}
    </div>
)

ManageProjectsRow.contextTypes = {
    accessToken: PropTypes.string
}

export default createFragmentContainer(
    ManageProjectsRow,
    graphql`
        fragment ManageProjectsRow_repo on Repository {
            name
            owner {
                login
            }
            bazrProject {
                id
            }
        }
    `
)
