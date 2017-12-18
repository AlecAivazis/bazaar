// the github oauth scopes that we care about
const oauthScopes = ['user:email', 'public_repo']

export default (req, res) =>
    // to kick off the oauth flow, redirect the user to GitHub's authorize endpoint
    console.log('redirecting to github') ||
    res.redirect(
        `https://github.com/login/oauth/authorize?scope=${oauthScopes.join(',')}&client_id=${
            process.env.GITHUB_CLIENT_ID
        }`
    )
