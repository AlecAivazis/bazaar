// external imports
import joinMonster from 'join-monster'
import { nodeDefinitions, fromGlobalId } from 'graphql-relay'
// local imports
import db from '../database'

export const { nodeInterface, nodeField } = nodeDefinitions(
    (globalId, context, resolveInfo) => {
        // parse the global id
        const { type, id } = fromGlobalId(globalId)

        // pass the query info to joinMonster and have it do the rest
        return joinMonster.getNode(type, resolveInfo, context, parseInt(id), db.raw)
    },
    // map a database object to its graphql type
    obj => obj.__type__
)
