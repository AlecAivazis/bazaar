// external imports
import fetch from 'isomorphic-fetch'
import querystring from 'querystring'
import bodyParser from 'body-parser'
// local imports
import * as handlers from './handlers'

// a decorator for the primary app
export default app => {
    /*
      The user is sent here if they do not have an access token present in local storage.
    */
    app.get('/oauth', handlers.oauthAsk)

    /*
      The user is redirected here once they have authorized with GitHub. GitHub adds a
      code query paramter to the redirect which we will use to generate an access token
      which the user will then persist locally after we redirect them back to the frontend
    */
    app.get('/oauthCallback', handlers.oauthCallback)

    /*
      This route is hit when one of the events we care about occurs in the bot account.
    */
    app.post('/bazrBotCallback', bodyParser.json(), handlers.botCallback)

    /*
      This route is hit by the webhook when activities occur on a particular project
    */
    app.post('/webhook', bodyParser.json(), handlers.webhook)
}
