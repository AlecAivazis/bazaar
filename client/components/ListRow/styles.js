import { grey1, grey2 } from 'quark-web/styles'

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
    hover: {
        backgroundColor: grey1
    },
    lastStyle: {
        ...container,
        borderBottomWidth: 1
    }
}
