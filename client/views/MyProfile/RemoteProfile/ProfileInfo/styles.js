import { grey4, grey3 } from 'quark-web/styles'

const valueStyle = {
    fontSize: 16
}

export default {
    name: {
        marginBottom: 4,
        fontSize: 14
    },
    value: {
        ...valueStyle,
        color: grey4
    },
    hiddenValue: {
        ...valueStyle,
        color: grey3,
        fontStyle: 'italic'
    }
}
