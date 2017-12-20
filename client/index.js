// external imports
import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Theme } from 'quark-web'
// local imports
import { Root } from './views'
import { EnvironmentProvider, Auth, Web3Check } from './components'
import { primaryColor, primaryShadow } from './styles'

ReactDOM.render(
    <Web3Check>
        <BrowserRouter>
            <Auth>
                {githubToken =>
                    githubToken && (
                        <EnvironmentProvider githubToken={githubToken}>
                            <Theme theme={{ primaryColor, primaryColorDark: primaryShadow }}>
                                <Root githubToken={githubToken} />
                            </Theme>
                        </EnvironmentProvider>
                    )
                }
            </Auth>
        </BrowserRouter>
    </Web3Check>,
    document.getElementById('root')
)
