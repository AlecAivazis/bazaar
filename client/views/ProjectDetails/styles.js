import { primaryColor } from '~/client/styles'

export default {
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32
    },
    links: {
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        alignItems: 'flex-end'
    },
    linkActive: {
        color: primaryColor
    },
    linkText: {
        fontSize: 18
    }
}
