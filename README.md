# bazr

[![Coverage Status](https://coveralls.io/repos/github/AlecAivazis/bazr/badge.svg)](https://coveralls.io/github/AlecAivazis/bazr) [![Greenkeeper badge](https://badges.greenkeeper.io/AlecAivazis/bazr.svg)](https://greenkeeper.io/)

A place to compensate open source development

## Running Locally

It is recommended that you run a local ethereum block chain to develop against. [Ganache](http://truffleframework.com/ganache/) is a good option with an easy-to-use UI. Once you have Ganache running locally, the next step is to configure a browser client for the network. This project was developed with [MetaMask](https://metamask.io/) in mind but should work with the Mist browser or any other environment with an embedded `web3` object globally accessible.

To configure MetaMask to run with Ganache, open the account tab in Ganache, and copy the private key for one of the users. Open MetaMask and import the key.

This project uses `npm` for package management. To install dependencies, run

```bash
npm install
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

And the development server for the client with:

```bash
npm run client
```

## Runing tests

The tests are written using [jest](https://facebook.github.io/jest/). To run them, execute the following command in your terminal:

```bash
npm run test
```
