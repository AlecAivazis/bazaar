// external imports
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
// local imports
import { Root } from './views'
import { EnvironmentProvider } from './components'

ReactDOM.render(
    <EnvironmentProvider>
        <BrowserRouter>
            <Root />
        </BrowserRouter>
    </EnvironmentProvider>,
    document.getElementById('root')
)
