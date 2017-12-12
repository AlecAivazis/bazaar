import { grey3 } from 'quark-core/styles'

export default {
    header: {
        borderBottomWidth: 1,
        borderColor: grey3,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headerText: {
        fontSize: 20,
        marginBottom: 12
    },
    userRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 16
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
    },
    metaData: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 8
    },
    metaDataText: {
        color: grey3,
        fontSize: 12,
        marginRight: 20
    }
}
