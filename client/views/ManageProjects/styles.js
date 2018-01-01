// external imports
import { grey2, grey4 } from 'quark-web/styles'

const repoRow = {
    height: 64,
    display: 'flex',
    justifyContent: 'space-between',
    boxSizing: 'border-box'
}

export default {
    container: {
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 40
    },
    header: {
        marginBottom: 24
    },
    description: {
        marginBottom: 24,
        color: grey4
    },
    repoRow
}
