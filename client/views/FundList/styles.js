import { grey3, grey4 } from 'quark-web/styles'

export default {
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32
    },
    row: {
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    statsRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    fundName: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    address: {
        marginLeft: 12,
        color: grey3,
        fontSize: 12
    },
    stat: {
        fontSize: 14,
        color: grey4,
        display: 'inline-flex'
    },
    constrainContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    star: {
        marginLeft: 2,
        fontSize: 14,
        color: grey4,
        display: 'flex'
    },
    separator: {
        fontSize: 14,
        color: grey4,
        display: 'flex',
        marginLeft: 4,
        marginRight: 4
    }
}
