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
    <Auth>
        {() => (
            <EnvironmentProvider>
                <BrowserRouter>
                    <Theme theme={{ primaryColor, primaryColorDark: primaryShadow }}>
                        <Root />
                    </Theme>
                </BrowserRouter>
            </EnvironmentProvider>
        )}
    </Auth>,
    document.getElementById('root')
)
