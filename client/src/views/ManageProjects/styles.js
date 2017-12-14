// external imports
import { grey2, grey4 } from 'quark-web/styles'

const repoRow = {
    paddingTop: 16,
    paddingBottom: 16,
    height: 64,
    borderBottom: `1px solid ${grey2}`,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    repoRow,
    firstRepoRow: {
        ...repoRow,
        borderTop: `1px solid ${grey2}`
    }
}
