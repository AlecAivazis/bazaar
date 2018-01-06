# bazr

[![Coverage Status](https://coveralls.io/repos/github/AlecAivazis/bazr/badge.svg)](https://coveralls.io/github/AlecAivazis/bazr) [![Greenkeeper badge](https://badges.greenkeeper.io/AlecAivazis/bazr.svg)](https://greenkeeper.io/)

A place to compensate open source development

## Running Locally

### Configuring Environment

`BazR` requires a few environment variables to develop locally as well
as fully function. To set these variables, create a file named `.env` in the root of the project with the following values. Variables with \* next to the name are only needed during development.

| Env Var                      | Purpose                                                                          | Notes                                                                         |
|------------------------------|----------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| GITHUB_SCHEMA_CLIENT_TOKEN * | Introspect the GitHub public API                                                 | This can be from your personal account                                        |
| GITHUB_BOT_ACCESS_TOKEN      | Perform GitHub actions as the bazr-bot account                                   |                                                                               |
| GITHUB_OAUTH_CLIENT_ID       | Part of the oauth flow                                                           |                                                                               |
| GITHUB_OAUTH_CLIENT_SECRET   | Part of the oauth flow                                                           |                                                                               |
| GITHUB_WEBHOOK_HOST          | The URL that the client should use when registering webhooks                     | For ease, [ngrok](https://ngrok.com/) is recommended when developping locally |
| SERVER_BLOCKCHAIN_ADDRESS    | Identifies the server's blockchain account to limit management of deployed funds | Grab this from Ganache                                                        |


### Running the application

This project uses `npm` for package management. To install dependencies, run

```bash
npm install -g tuffle && npm install
```

Before we can start the server, we have to create a database that we can use in local development.
This project is configured to run against an sqlite database locally. To provision it, run:

```bash
npm run db:init
```

Once that completes, you can start the server with:

```bash
npm run server
```

The client is uses Relay and must have a static version of the schema in order to build the frontend. To compile this file, run the following command with the server running at port `4000`

```bash
npm run build:schema && npm run relay
```

Once the relay assets are generated, you can start the client development server with:

```bash
npm run client
```

## Runing tests

The client and server tests are written using [jest](https://facebook.github.io/jest/). To run them, execute the following command in your terminal:

```bash
npm run test
```

The contract tests are written using [truffle]'s flavor of mocha. To run them, execute the following command in your terminal

```bash
npm run contracts:test
```
