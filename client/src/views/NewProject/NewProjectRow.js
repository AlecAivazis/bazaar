// @flow
// external imports
import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { Title, Text, IconCheckCircle, Button } from 'quark-web'
// local imports
import type { NewProjectRow_repo } from './__generated__/NewProjectRow_repo.graphql'
import styles from './styles'

type Props = {
    repo: NewProjectRow_repo,
    first: boolean,
    last: boolean
}

// the connected indicator
const ConnectedIndicator = () => (
    <div style={{ display: 'flex', color: '#58AD66', flexDirection: 'row', alignItems: 'center' }}>
        <IconCheckCircle />
        <Text style={{ marginLeft: 4, color: '#58AD66' }}>connected</Text>
    </div>
)

// the cta to connect the project to bazr
const ConnectCTA = () => (
    <Button size="small" style={{ minWidth: 90 }}>
        connect
    </Button>
)

const NewProjectRow = ({ repo, first }: Props) => (
    <div style={first ? styles.firstRepoRow : styles.repoRow}>
        <Title style={{ display: 'flex', alignItems: 'center', fontWeight: '100' }}>
            {repo.owner.login} / {repo.name}
        </Title>
        {repo.bazrProject ? <ConnectedIndicator /> : <ConnectCTA />}
    </div>
)

export default createFragmentContainer(
    NewProjectRow,
    graphql`
        fragment NewProjectRow_repo on Repository {
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
