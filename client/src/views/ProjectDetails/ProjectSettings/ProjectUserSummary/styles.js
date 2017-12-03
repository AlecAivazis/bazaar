import { grey3 } from 'quark-core/styles'

export default {
    header: {
        borderBottomWidth: 1,
        borderColor: grey3
    },
    headerText: {
        fontSize: 20,
        marginBottom: 12
    },
    userRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 12,
        justifyContent: 'space-between'
    },
    avatarContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {
        height: 36,
        weight: 36,
        borderRadius: '50%',
        marginRight: 12
    }
}
