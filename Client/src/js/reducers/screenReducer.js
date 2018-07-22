const initialState = {
    provideCredentials: {
        showKuwaPassword: false,
        showPasscode: false
    },
    navigation: {
        collapsed: true,
        dropdown: {
            sponsors: true,
            registrars: true,
            faucets: true,
            registrationActions: true
        }
    },
    dropdowns: {}
}

const screenReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'TOOGLE_DROPDOWN':
            let dropdownName = action.payload.dropdownName;
            if (state.dropdowns[dropdownName]) {
                return Object.assign({}, state, {
                    dropdowns: Object.assign({}, state.dropdowns, {
                        [dropdownName]: !state.dropdowns[dropdownName]
                    })
                })
            } else {
                return Object.assign({}, state, {
                    dropdowns: Object.assign({}, state.dropdowns, {
                        [dropdownName]: true
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