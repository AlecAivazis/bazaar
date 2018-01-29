// external imports
import fetch from 'isomorphic-fetch'
import querystring from 'querystring'
// local imports
import database from '~/server/database'

export default async (req, res) => {
    // grab the `code` parameter from the request
    const { code } = req.query

    // if there is no query param
    if (!code) {
        // we're done here
        return res.status(500).send('COULD NOT FIND CODE PARAMETER')
    }

    // send it back to github
    let response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
            client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
            code
        })
    })

    // grab the text of the response
    const body = await response.text()

    try {
        // try to parse the response as a query string
        const { access_token: token, ...rest } = querystring.parse(body)

        // if we dont have an access token from github
        if (!token) {
            throw new Error('Could not find access token in github response.')
        }

        // try to get the account name of the user that just logged in
        // send the graphql query
        response = await (await fetch('https://api.github.com/graphql', {
            method: 'POST',
            body: JSON.stringify({ query: `{ viewer { login } }` }),
            headers: {
                Authorization: `token ${token}`
            }
        })).json()

        // parse ther response as json
        const { data: { viewer: { login } } } = response

        // if we have never seen this account name before
        if ((await database('users').where({ accountName: login })).length === 0) {
            // create an entry in our database with the user
            await database('users').insert({ accountName: login })
        }

        // redirect the user back to the frontend with the access token as a param
        return res.redirect(`http://localhost:3000/?token=${token}`)
    } catch (err) {
        // if we couldn't parse it as json
        return res.status(500).send(err)
    }
}
