// external imports
import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

export default new GraphQLScalarType({
    name: 'ContractAddress',
    description: 'The address of a particular contract',
    parseValue: value => value,
    serialize: value => value,
    parseLiteral: ast => {
        if (ast.kind === Kind.STRING) {
            return ast.value
        }
        return null
    }
})
