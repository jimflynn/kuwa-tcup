const initialState = {
    provideCredentials: {
        showKuwaPassword: false,
        showPasscode: false
    },
    navigation: {
        collapsed: true
    },
    dropdowns: {},
    drawerOpen: false
}

const screenReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'TOOGLE_DROPDOWN':
            let linkName = action.payload.linkName;
            if (state.dropdowns[linkName]) {
                return Object.assign({}, state, {
                    dropdowns: Object.assign({}, state.dropdowns, {
                        [linkName]: !state.dropdowns[linkName]
                    })
                })
            } else {
                return Object.assign({}, state, {
                    dropdowns: Object.assign({}, state.dropdowns, {
                        [linkName]: true
                    })
                })
            }
        case  'TOGGLE_KUWA_PASSWORD_VISIBILITY':
            return Object.assign({}, state, {
                provideCredentials: Object.assign({}, state.provideCredentials, {
                    showKuwaPassword: !state.provideCredentials.showKuwaPassword
                })
            })
        case 'TOGGLE_PASSCODE_VISIBILITY':
            return Object.assign({}, state, {
                provideCredentials: Object.assign({}, state.provideCredentials, {
                    showPasscode: !state.provideCredentials.showPasscode
                })
            })
        case 'TOGGLE_DRAWER':
            return Object.assign({}, state, {
                drawerOpen: !state.drawerOpen
            })
        case 'TOGGLE_COLLAPSE':
            return Object.assign({}, state, {
                navigation: Object.assign({}, state.navigation, {
                    collapsed: !state.navigation.collapsed
                })
            })
        default:
            return state
    }
}

export default screenReducer;