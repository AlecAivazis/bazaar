import { grey1, grey3, grey5, grey4 } from 'quark-web/styles'

export default {
    container: {},
    header: { marginBottom: 12 },
    issueRowContainer: {
        marginBottom: 80
    },
    issueRow: {
        height: 64,
        borderBottomWidth: 1,
        borderColor: grey3,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20
    },
    hoverStyle: {
        backgroundColor: grey1
    },
    issueTitle: {
        color: grey5,
        fontSize: 14
    },
    votes: {
        color: grey4,
        fontSize: 14
    }
}
