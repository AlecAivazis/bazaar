// external imports
import { Environment, Network, RecordSource, Store } from 'relay-runtime'

// define how queries are performed
async function fetchQuery(operation, variables, cacheConfig, uploadables) {
    // perform the query
    const result = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
            // Add authentication and other headers here
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            query: operation.text, // GraphQL text from input
            variables
        })
    })

    // parse the result like json
    return await response.json()
}

// export the relay environment object
export default new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource())
})
