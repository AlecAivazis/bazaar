// external imports
import Web3 from 'web3'
// local imports
import _FundArtifact from './build/Fund.json'

export let Fund
export let FundArtifact

const localWeb3 = new Web3()

// a check if we're running in the browser
const isBrowser = typeof process === 'undefined' || process.browser

// the provider we use depends if we're in a browser or not
const provider =
    isBrowser && window.web3
        ? window.web3.currentProvider || new Web3.providers.HttpProvider('http://localhost:8545')
        : new Web3.providers.HttpProvider(
              `https://${process.env.ETHEREUM_NETWORK}.infura.io/${process.env.INFURA_ACCESS_TOKEN}`
          )

// make sure the correct provider is used
localWeb3.eth.setProvider(provider)

FundArtifact = _FundArtifact
Fund = new localWeb3.eth.Contract(_FundArtifact.abi)
Fund.setProvider(provider)

// if we are in a browser, set a global web3 instance
if (isBrowser) {
    console.log
    // a global web3 instance to use
    window.web3 = localWeb3
}
