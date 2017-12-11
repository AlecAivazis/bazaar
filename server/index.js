// external imports
import express from 'express'
import * as bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { config as configEnv } from 'dotenv'
import fetch from 'isomorphic-fetch'
import querystring from 'querystring'
// local imports
import schema from './schema'

// load environment variables
configEnv()

// an express app to use
const app = express()

// attach the graphql endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))
// add graphiql
app.use(
    '/graphiql',
    graphiqlExpress({
        endpointURL: '/graphql'
    })
)

// the user is sent here if they do not have an access token present in local storage
app.get('/oauth', (req, res) =>
    // to kick off the oauth flow, redirect the user to GitHub's authorize endpoint
    res.redirect(
        `https://github.com/login/oauth/authorize?scope=user:email&client_id=${
            process.env.GITHUB_CLIENT_ID
        }`
    )
)

/*
 The user is redirected here once they have authorized with GitHub. GitHub adds a
 code query paramter to the redirect which we will use to generate an access token
 which the user will then persist locally after we redirect them back to the frontend
*/
app.get('/oauthCallback', async (req, res) => {
    // grab the `code` parameter from the request
    const { code } = req.query

    // if there is no query param
    if (!code) {
        // we're done here
        return res.status(500).send('COULD NOT FIND CODE PARAMETER')
    }

    // send it back to github
    const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code
        })
    })

    // grab the text of the response
    const body = await response.text()

    try {
        // try to parse the response as a query string
        const { access_token: token } = querystring.parse(body)

        // redirect the user back to the frontend with the access token as a param
        return res.redirect(`http://localhost:3000/?token=${token}`)
    } catch (err) {
        // if we couldn't parse it as json
        return res.status(500).send(body)
    }
})

// start the server
app.listen(4000, () => console.log('listening on :4000'))
