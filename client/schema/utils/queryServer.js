export default async (query, endpoint = '/graphql') => {
    // send the graphql query
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    })

    // if we weren't successful
    if (String(response.status)[0] !== '2') {
        // yell loudly
        throw new Error(await response.text())
    }

    // parse the response as json
    const body = await response.json()

    // if there is an error
    if (body.errors) {
        throw new Error(body.errors)
    }

    return body.data
}
