// @flow
// external imports
import * as React from 'react'
import { Button, BooleanState } from 'quark-web'
// local imports
import { connectProject } from '../../mutations'
import { ConnectedIndicator } from './ManageProjectsRow'

// the cta to connect the project to bazr
const ConnectCTA = ({
    repo,
    environment,
    accessToken
}: {
    environment: RelayEnvironment,
    repo: ManageProjectsRow_repo,
    accessToken: string
}) => (
    <BooleanState>
        {({ state: connected, toggle }) =>
            !connected ? (
                <Button
                    size="small"
                    style={{ minWidth: 90 }}
                    onClick={() =>
                        connectProject({
                            environment,
                            input: {
                                name: repo.name,
                                owner: repo.owner.login,
                                accessToken
                            },
                            onCompleted: (response, errs) => {
                                // if something went wrong
                                if (errs) {
                                    // tell the user something went wrong
                                    console.error('Encountered error during request:', errs[0].message)
                                    // we're done here
                                    return
                                }

                                // we succeeded to flip from unconnected to connected
                                toggle()
                            }
                        })
                    }
                >
                    connect
                </Button>
            ) : (
                <ConnectedIndicator />
            )
        }
    </BooleanState>
)

export default ConnectCTA
