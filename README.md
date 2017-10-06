# bazr

A place to compensate open source development

## Running locally

To run locally, install `run`: 

```bash
go get github.com/AlecAivazis/run
```
and then run the installation task:
```bash
run install-deps
```

You're then ready to start the test net:
```bash
run testnet
```

In order to build the go server, you first have to build the contract clients:
```
run build-contracts
```
