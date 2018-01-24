// external imports
import Web3 from 'web3'
// local imports
import _FundArtifact from './build/Fund.json'

export let Fund
export let FundArtifact

if (typeof window !== 'undefined' && window.web3) {
    // figure out if there is an injected environment
    const provider = web3.currentProvider || new Web3.providers.HttpProvider('http://localhost:8545')

    // a global web3 instance to use
    window.web3 = new Web3()
    // make sure the correct provider is used
    web3.eth.setProvider(provider)

    FundArtifact = _FundArtifact
    Fund = new window.web3.eth.Contract(_FundArtifact.abi)
    Fund.setProvider(provider)
}
