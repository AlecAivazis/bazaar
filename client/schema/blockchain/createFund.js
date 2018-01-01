// external imports
import { offsetToCursor } from 'graphql-relay'
// local improts
import { Fund, FundArtifact } from '~/contracts'
import { queryServer, promisify } from '~/client/schema/utils'

const deployFund = async (name, value = 0) => {
    // grab the user's account
    const [from] = await web3.eth.getAccounts()

    // deploy a fund with the specified deposit and get the hash of the transaction
    const txHash = await new Promise((resolve, reject) =>
        Fund.deploy({
            arguments: [process.env.SERVER_BLOCKCHAIN_ADDRESS],
            data: FundArtifact.bytecode
        })
            .send({
                value: web3.utils.toWei(value.toString(), 'ether'),
                from
            })
            .on('transactionHash', resolve)
            .on('error', reject)
    )

    console.log('deployed fund. txHash:', txHash)

    // if something went wrong (the user cancelled for example)
    if (!txHash) {
        throw new Error('A silent error occured (no transaction hash was returned).')
    }

    // return the address
    return txHash
}

export default async (_, { input: { name, deposit } }) => {
    // create the fund contract
    const address = await deployFund(name, deposit)

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
