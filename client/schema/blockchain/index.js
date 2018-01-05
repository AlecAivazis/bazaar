// external imports
import { GraphQLScalarType } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'
import BigNumber from 'bignumber.js'
import { Kind } from 'graphql/language'
import { withFilter, PubSub } from 'graphql-subscriptions'
import moment from 'moment'
import web3 from 'web3'
// local imports
import { Fund } from '~/contracts'
import { promisify, sleep } from '~/client/schema/utils'

// track if we are listening to a fund
// const watchingFund = {}
// const pubsub = new PubSub()
// const NEW_CONTRACT_TRANSACTION = 'new_contract_transaction'
// setInterval(() => {
//     console.log('publishing')
//     pubsub.publish(NEW_CONTRACT_TRANSACTION, {})
// }, 1500)

export default makeExecutableSchema({
    typeDefs: `
        scalar BigNumber
        scalar DateTime

        input DepositEtherInput {
            address: String!
            amount: BigNumber!
        }

        type ContractDeposit {
            userAddress: String!
            amount: BigNumber!
            balance: BigNumber!
            time: DateTime!
        }

        type ContractWithdrawl {
            userAddress: String!
            projectName: String!
            amount: BigNumber!
            balance: BigNumber!
            time: DateTime!
        }

        union ContractTransaction = ContractWithdrawl | ContractDeposit

        type FundContract {
            balance: BigNumber!
            address: String!
            transactions: [ContractTransaction!]!
        }

        type Query {
            fundContract(address: String!): FundContract
        }

        type Mutation {
            depositEther(input: DepositEtherInput!): String!
        }

        type Subscription {
            fundTransaction(address: String!): ContractTransaction
        }
    `,
    resolvers: {
        FundContract: {
            balance: fund => window.web3.eth.getBalance(fund.options.address),
            address: fund => fund.options.address,
            transactions: async fund => {
                // grab the number of transactions associated with the fund
                const numberOfTransactions = await fund.methods.numberOfTransactions().call()

                const transactions = []
                // build up a list of transaction lookups
                for (let i = 0; i < numberOfTransactions; i++) {
                    transactions.push(fund.methods.transaction(i).call())
                }

                // return the array encoded structs as objects with the relevant information
                return (await Promise.all(transactions)).map(
                    ({ account, projectName, direction, amount, time, balance }) => ({
                        userAddress: account,
                        projectName,
                        direction: parseInt(direction.toString()),
                        amount,
                        balance,
                        time
                    })
                )
            }
        },
        ContractTransaction: {
            __resolveType: (obj, context, info) => {
                switch (obj.direction) {
                    case 0:
                        return 'ContractDeposit'
                    case 1:
                        return 'ContractWithdrawl'
                }
            }
        },
        Query: {
            fundContract: (_, { address }) => {
                // update the fund's address
                const fund = Fund.clone()
                fund.options.address = address
                fund.setProvider(window.web3.eth.currentProvider)
                // get the contract at the specified address
                return fund
            }
        },
        Mutation: {
            depositEther: async (_, { input: { address: fundAddress, amount } }) => {
                // build up a fund instance at the designated address
                const fund = Fund.clone()
                fund.options.address = fundAddress
                fund.setProvider(window.web3.eth.currentProvider)

                // grab the user's account
                const [from] = await window.web3.eth.getAccounts()

                // deposit the ether into the designated fund
                const txHash = await new Promise((resolve, reject) =>
                    fund.methods
                        .deposit()
                        .send({
                            value: web3.utils.toWei(amount.toString(), 'ether'),
                            from
                        })
                        .on('transactionHash', resolve)
                        .on('error', reject)
                )

                console.log('deposited ether. txHash:', txHash)

                // we're done here
                return txHash
            }
        },
        Subscription: {
            fundTransaction: {
                resolve: fundTransaction => {
                    return {
                        fundTransaction
                    }
                },
                subscribe: () => pubsub.asyncIterator(NEW_CONTRACT_TRANSACTION)
            }
        },
        BigNumber: new GraphQLScalarType({
            name: 'BigNumber',
            serialize: value => value,
            parseValue: value => {
                return new BigNumber(value)
            },
            parseLiteral(ast) {
                if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
                    return new BigNumber(ast.value)
                }

                return null
            }
        }),
        DateTime: new GraphQLScalarType({
            name: 'DateTime',
            serialize: value => value,
            parseValue: value => moment.unix(value),
            parseLiteral(ast) {
                if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
                    return parseInt(ast.value)
                }

                return null
            }
        })
    }
})
