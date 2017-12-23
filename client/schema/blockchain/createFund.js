// external imports
import { offsetToCursor } from 'graphql-relay'
// local improts
import { Fund } from '~/client/contracts'
import { queryServer } from '~/client/utils'

const deployFund = name =>
    new Promise((resolve, reject) => {
        // deploy a fund using the clients eth integration
        Fund.new(
            {
                from: window.web3.eth.accounts[0]
            },
            (err, data) => {
                // make sure nothing went wrong
                if (err) {
                    return reject(err)
                }
                // if the transaction was rejected
                if (!data) {
                    resolve()
                }
                const { address, transactionHash } = data

                // when the contract doesn't have an address (normalizes: https://github.com/MetaMask/metamask-extension/issues/2426)
                if (!err && !address) {
                    // wait for the transaction receipt
                    window.web3.eth.getTransactionReceipt(transactionHash, (err, { contractAddress: address }) => {
                        // make sure nothing went wrong
                        if (err) {
                            return reject(err)
                        }

                        // we're done here
                        return resolve(address)
                    })
                }
            }
        )
    })

export default async (_, { name }) => {
    // create the fund contract
    const address = await deployFund(name)

    // create the corresponding fund on the server
    const { CreateFund: { fund: { id } } } = await queryServer(`
        mutation {
            CreateFund(input: { name: "${name}", address: "${address}"}) {
                fund {
                    id
                }
            }
        }
    `)

    // return the fund we just made
    return {
        cursor: offsetToCursor(id),
        node: {
            name,
            address,
            id
        }
    }
}
