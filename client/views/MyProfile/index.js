// external imports
import React from 'react'
import { graphql } from 'react-relay'
import { H1, FlexColumn, FlexRow, Label, Input, Form } from 'quark-web'
// local imports
import { QueryRenderer } from '~/client/components'
import styles from './styles'
import RemoteProfile from './RemoteProfile'
import WalletSummary from './WalletSummary'

const MyProfile = () => (
    <React.Fragment>
        <H1 style={styles.header}>My Profile</H1>
        <QueryRenderer
            query={graphql`
                query MyProfileQuery {
                    viewer {
                        ...RemoteProfile_viewer
                        ...WalletSummary_viewer
                    }
                }
            `}
            render={({ viewer }) => (
                <FlexColumn>
                    <RemoteProfile viewer={viewer} />
                    <WalletSummary viewer={viewer} />
                </FlexColumn>
            )}
        />
    </React.Fragment>
)

export default MyProfile
