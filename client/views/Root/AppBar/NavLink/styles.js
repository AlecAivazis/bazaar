const container = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 8
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
