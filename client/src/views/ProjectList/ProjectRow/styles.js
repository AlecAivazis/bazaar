import { grey4, grey2, grey1 } from 'quark-core/styles'

const container = {
    display: 'flex',
    flexDirection: 'row',
    height: 100,
    borderTopWidth: 1,
    borderColor: grey2,
    padding: 18,
    cursor: 'pointer'
}

export default {
    container,
    containerHover: {
        ...container,
        backgroundColor: grey1
    },
    infoContainer: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    title: {
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
