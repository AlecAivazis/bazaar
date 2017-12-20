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
        alignItems: 'flex-end',
        fontSize: 20
    },
    address: {
        marginLeft: 12,
        color: grey3,
        fontSize: 12
    },
    stat: {
        fontSize: 14,
        color: grey4,
        display: 'flex'
    },
    starContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    }
}
