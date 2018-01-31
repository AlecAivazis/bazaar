// external imports
import Web3 from 'web3'
import Tx from 'ethereumjs-tx'
import BigNumber from 'bignumber.js'
// local imports
import { Fund } from '~/contracts'

import dotenv from 'dotenv'
dotenv.config()

// transfer ether from funds to a user
export default async ({ from, to, projectName, amount }) => {
    // the url for the provider
    const providerUrl = `https://${process.env.ETHEREUM_NETWORK}.infura.io/${process.env.INFURA_ACCESS_TOKEN}`
    // point the transfer to the infura provider
    const provider = new Web3.providers.HttpProvider(providerUrl)

    // create an instance of the fund
    const fund = Fund.clone()
    fund.setProvider(provider)
    // direct the fund at the from address
    fund.options.address = from

    // build a web3 instance while we're at it
    const web3 = new Web3(provider)

    // the method we are going to call
    const method = fund.methods.transferReward(to, projectName, Web3.utils.toWei(amount, 'ether'))

    const txData = {
        nonce: await web3.eth.getTransactionCount(process.env.SERVER_BLOCKCHAIN_ADDRESS),
        to: from,
        data: method.encodeABI(),
        gasPrice: await web3.eth.getGasPrice(),
        gasLimit: new BigNumber(
            await method.estimateGas({
                from: process.env.SERVER_BLOCKCHAIN_ADDRESS,
                to: from
            })
        )
            .mul('1.2')
            .toString()
    }

    // the transaction we are going to sign offline
    const tx = new Tx(txData)

    // sign the transaction with the server's private key
    tx.sign(Buffer.from(process.env.SERVER_BLOCKCHAIN_PRIVATE_KEY, 'hex'))
    const serializedTx = tx.serialize()

    // send the signed transaction and hold onto the receipt hash
    const value = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))

    // send the raw transaction to the client and return it's transaction hash
    return value
}
