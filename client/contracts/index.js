// local imports
import FundArtifact from '~/contracts/build/Fund.json'

export const Fund = window.web3 ? window.web3.eth.contract(FundArtifact.abi) : null
