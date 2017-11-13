# bazr
[![Coverage Status](https://coveralls.io/repos/github/AlecAivazis/bazr/badge.svg)](https://coveralls.io/github/AlecAivazis/bazr)

A place to compensate open source development

## Getting Started

To run locally, first install `solc`: 
```
brew update
brew upgrade
brew tap ethereum/ethereum
brew install solidity
brew linkapps solidity
```

Then install `run` which is used to manage the development tasks for bazr: 

```bash
go get github.com/AlecAivazis/run
```
run the installation task:
```bash
run install-deps
```
initialize the testnet
```bash
run genesis
```

## Running Locally

Start the test net:
```bash
run testnet
```

In order to build the go server, you first have to build the contract clients:
```
run build-contracts
```
