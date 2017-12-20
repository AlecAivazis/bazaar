// external imports
import { GraphQLScalarType } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'
import BigNumber from 'bignumber.js'
import { Kind } from 'graphql/language'
// local imports
import { Fund } from '../../contracts'

export default makeExecutableSchema({
    typeDefs: `
        scalar BigNumber

        type FundContract {
            balance: BigNumber!
            address: String!
        }

        type Query {
            fundContract(address: String!): FundContract
        }
    `,
    resolvers: {
        FundContract: {
            balance: ({ address }) =>
                new Promise((resolve, reject) =>
                    window.web3.eth.getBalance(address, (err, balance) => {
                        // if something went wrong
                        if (err) {
                            return reject(err)
                        }

                        // we're done compute the balance
                        return resolve(balance)
                    })
                )
        },
        Query: {
            fundContract: (_, { address }) => {
                // get the contract at the specified address
                return {
                    address
                }
            }
        },
        BigNumber: new GraphQLScalarType({
            name: 'BigNumber',
            serialize: value => value,
            parseValue: value => {
                console.log(value)
                return new BigNumber(value)
            },
            parseLiteral(ast) {
                console.log(ast)
                if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
                    return new BigNumber(ast.value)
                }

                return null
            }
        })
    }
})
