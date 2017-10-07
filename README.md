# bazr

A place to compensate open source development

## Getting Started

To run locally, install `run`: 

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
