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
    }
}

const screenReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'TOOGLE_DROPDOWN':
            let componentName = action.payload.componentName;
            let dropdownName = action.payload.dropdownName;
            return Object.assign({}, state, {
                [action.payload.componentName]: {
                    dropdown: Object.assign({}, state[componentName].dropdown, {
                        [dropdownName]: !state[componentName].dropdown[dropdownName]
                    })
                }
            })
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
        default:
            return state
    }
}

export default screenReducer;