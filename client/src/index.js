// external imports
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Theme } from 'quark-web'
// local imports
import { Root } from './views'
import { EnvironmentProvider, Auth } from './components'
import { primaryColor, primaryShadow } from './styles'

ReactDOM.render(
    <BrowserRouter>
        <Auth>
            {githubToken =>
                githubToken && (
                    <EnvironmentProvider githubToken={githubToken}>
                        <Theme theme={{ primaryColor, primaryColorDark: primaryShadow }}>
                            <Root />
                        </Theme>
                    </EnvironmentProvider>
                )
            }
        </Auth>
    </BrowserRouter>,
    document.getElementById('root')
)
