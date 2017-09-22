package mutations

import (
	"fmt"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/graphql-go/graphql"

	"github.com/alecaivazis/bazr/server/api/objectTypes"
	"github.com/alecaivazis/bazr/server/contracts"
	"github.com/alecaivazis/bazr/server/funds"
)

var key = `{"address":"5893943e8ac0505803b06678993c770a205b1d51","crypto":{"cipher":"aes-128-ctr","ciphertext":"b0937064e79bab360d0bd5a051599804a24c064782d4244784d3d0502570dd8f","cipherparams":{"iv":"2c6c19e6e90b6da10eb971257458f186"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"88d468958f77fdb9ec77d0942a310b8c9747020c86dc7e47982d77e21f80d826"},"mac":"f3b25dc6c1590ca3907fd86915468c577c5114d5ce815403c34c74625d273a6b"},"id":"b3bec982-1797-4d0d-a854-2792044780f1","version":3}`
var passphrase = "password"

var createFund = &graphql.Field{
	Type:        objectTypes.FundDefinition.EdgeType,
	Description: "Create a new fund for the specified user",
	Resolve: func(params graphql.ResolveParams) (interface{}, error) {
		// create an IPC based RPC connection to a remote node
		conn, err := ethclient.Dial("http://localhost:8545")
		if err != nil {
			return nil, fmt.Errorf("Failed to connect to the Ethereum client: %v", err)
		}

		// instantiate a transactor to sign the operations
		auth, err := bind.NewTransactor(strings.NewReader(key), passphrase)
		if err != nil {
			return nil, fmt.Errorf("Failed to create authorized transactor: %v", err)
		}

		// deploy a mortal contract to the chain
		address, tx, _, err := contracts.DeployMortal(auth, conn)
		if err != nil {
			return nil, fmt.Errorf("Failed to deploy fund contract: %v", err)
		}
		fmt.Printf("Contract pending deploy: 0x%x\n", address)
		fmt.Printf("Transaction waiting to be mined: 0x%x\n\n", tx.Hash())

		// return the fund we just instantiated
		return funds.Fund{
			Address: address.Str(),
			ID:      "1",
		}, nil
	},
}
