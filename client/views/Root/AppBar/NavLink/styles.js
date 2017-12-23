const container = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 12
}

export default {
    inactive: {
        ...container
    },
    active: {
        ...container,
        backgroundColor: '#EAEAEE'
    }
}
