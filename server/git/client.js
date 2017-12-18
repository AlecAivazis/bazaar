// external imports
import fetch from 'isomorphic-fetch'
import { config } from 'dotenv'

config()

export default class GithubRepoClient {
    constructor(owner, repo, accessToken) {
        this._token = accessToken || process.env.GITHUB_BOT_ACCESS_TOKEN
        this._owner = owner
        this._repo = repo
    }

    get readme() {
        return this._request(`readme`).then(response => response.json())
    }

    get parent() {
        return this.query(
            `
                ... on Repository {
                    isFork
                    parent {
                        name
                        owner {
                            login
                        }
                    }
                }
            `
        ).then(async ({ isFork, parent }) => {
            // if there is no parent
            if (!isFork) {
                return null
            }

            // return a repo client with the
            return new GithubRepoClient(parent.owner.login, parent.name)
        })
    }

    updateFile = ({ path, ...config }) =>
        this._request(`contents/${path}`, {
            method: 'PUT',
            headers: {},
            body: JSON.stringify(config)
        }).then(response => response.json())

    submitPR = config =>
        this._request('pulls', {
            method: 'POST',
            body: JSON.stringify(config)
        })

    query = query =>
        this._graphqlRequest(
            `
            query {
                repository(owner: "${this._owner}", name:"${this._repo}") {
                    ${query}
                }
            }
        `
        ).then(async data => {
            return data.repository
        })

    fork = () => this._request('forks', { method: 'POST' })

    delete = () => this._request('', { method: 'DELETE' })

    _request = async (url, { method = 'GET', headers = {}, ...config } = {}) => {
        // make this a no-op in a test env
        if (process.env.NODE_ENV === 'test') {
            return
        }

        // github doesn't allow trailing / so we can only include it if url is truthy
        const tail = url ? `/${url}` : ''

        console.log(
            'hitting github api',
            `https://api.github.com/repos/${this._owner}/` + `${this._repo}${tail}`
        )
        // the owner and name of the repo
        const response = await fetch(
            `https://api.github.com/repos/${this._owner}/` + `${this._repo}${tail}`,
            {
                method,
                headers: {
                    ...headers,
                    Authorization: `token ${this._token}`
                },
                ...config
            }
        )

        // if we weren't successful
        if (String(response.status)[0] !== '2') {
            // yell loudly
            throw new Error(await response.text())
        }

        // we were sucessfull so parse it as json
        return response
    }

    _graphqlRequest = async query => {
        // make this a no-op in a test env
        if (process.env.NODE_ENV === 'test') {
            return
        }

        // send the graphql query
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            body: JSON.stringify({ query }),
            headers: {
                Authorization: `token ${this._token}`
            }
        })

        // parse ther response as json
        return (await response.json()).data
    }
}
