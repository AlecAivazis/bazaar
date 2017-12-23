// @flow
// external imports
import * as React from 'react'
import { Button, BooleanState } from 'quark-web'
// local imports
import { connectProject } from '~/client/mutations'
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
                    onClick={async () => {
                        try {
                            // create the project
                            await connectProject({
                                environment,
                                input: {
                                    name: repo.name,
                                    owner: repo.owner.login,
                                    accessToken
                                }
                            })
                        } catch (errs) {
                            return console.error('Encountered error during request:', errs[0].message)
                        }

                        // flip the cta to the newly connected state
                        toggle()
                    }}
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
