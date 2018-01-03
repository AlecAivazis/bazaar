// external imports
import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { FlexRow, FlexColumn } from 'quark-web'
// local imports
import styles from './styles'
import ProfileInfo from './ProfileInfo'

const RemoteProfile = ({ viewer }) => (
    <FlexRow style={styles.container}>
        <img src={viewer.avatarUrl} style={styles.avatar} />
        <FlexColumn justifyContent="space-between" style={styles.infoContainer}>
            <ProfileInfo name="Name" value={viewer.name} />
            <ProfileInfo name="GitHub Account" value={viewer.login} />
            <ProfileInfo name="E-Mail" value={viewer.email} />
        </FlexColumn>
    </FlexRow>
)

export default createFragmentContainer(
    RemoteProfile,
    graphql`
        fragment RemoteProfile_viewer on User {
            avatarUrl
            login
            email
            name
        }
    `
)
