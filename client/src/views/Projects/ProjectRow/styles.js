import { grey5, grey4, grey2 } from 'quark-core/styles'

export default {
    container: {
        display: 'flex',
        flexDirection: 'row',
        height: 100,
        borderTopWidth: 1,
        borderColor: grey2,
        padding: 18
    },
    infoContainer: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column'
    },
    title: {
        fontWeight: '200',
        fontSize: 18,
        color: grey5,
        marginBottom: 12
    },
    statContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    stat: {
        marginRight: 20,
        fontSize: 14,
        fontWeight: '100',
        color: grey4
    }
}
