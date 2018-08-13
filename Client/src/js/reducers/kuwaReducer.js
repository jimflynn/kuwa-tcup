const initialState = {
    usingCordova: window.usingCordova,
    kuwaId: {
        registrationStatus: "New",
        address: "Your Kuwa ID has not been generated.",
        challenge: "You need to be sponsored to get a challenge number.",
        kuwaNetwork: []
    },
    screen: {
        provideCredentials: {loading: false},
        requestSponsorship: {loading: false},
        uploadToStorage: {loading: false},
        success: {helpText: ''},
        error: {helpText: ''}
    }
}

const kuwaReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'CREATE_KEYS_PENDING':
            return Object.assign({}, state, {
                screen: Object.assign({}, state.screen, {
                    provideCredentials: {
                        loading: true
                    }
                })
            })
        case 'CREATE_KEYS_FULFILLED':
            return Object.assign({}, state, {
                kuwaId: Object.assign({}, state.kuwaId, {
                    address: '0x' + action.payload.keyObject.address,
                    privateKey: '0x' + action.payload.privateKeyInHex,
                    keyObject: action.payload.keyObject,
                    sponsored: false,
                    infoUploaded: false,
                    unlocked: false,
                    qrCodeSrc: action.payload.qrCodeSrc
                })
            })    
        case 'REQUEST_SPONSORSHIP_PENDING':
            return state;
        case 'REQUEST_SPONSORSHIP_FULFILLED':
            return Object.assign({}, state, {
                kuwaId: Object.assign({}, state.kuwaId, {
                    sponsored: true,
                    unlocked: true,
                    contractAddress: action.payload.responseJson.contractAddress,
                    abi: action.payload.responseJson.abi,
                    challenge: action.payload.challenge,
                    registrationStatus: action.payload.registrationStatus
                }),
                screen: Object.assign({}, state.screen, {
                    provideCredentials: {
                        loading: false
                    }
                })
            })
        case 'CREATE_KEYS_REJECTED':
        case 'REQUEST_SPONSORSHIP_REJECTED':
            return Object.assign({}, state, {
                screen: Object.assign({}, state.screen, {
                    provideCredentials: {
                        loading: false
                    },
                    error: {
                        helpText: action.payload.error
                    }
                })
            })
        case 'UPLOAD_TO_STORAGE_PENDING':
        case 'WEB_UPLOAD_TO_STORAGE_PENDING':
            return Object.assign({}, state, {
                screen: Object.assign({}, state.screen, {
                    uploadToStorage: {
                        loading: true
                    }
                })
            })
        case 'UPLOAD_TO_STORAGE_FULFILLED':
        case 'WEB_UPLOAD_TO_STORAGE_FULFILLED':
            return Object.assign({}, state, {
                kuwaId: Object.assign({}, state.kuwaId, {
                    infoUploaded: true,
                    registrationStatus: action.payload.registrationStatus
                }),
                screen: Object.assign({}, state.screen, {
                    uploadToStorage: {
                        loading: false,
                    },
                    success: {
                        helpText: 'You are now part of the Kuwa community.'
                    }
                })
            })
        case 'UPLOAD_TO_STORAGE_REJECTED':
        case 'WEB_UPLOAD_TO_STORAGE_REJECTED':
            return Object.assign({}, state, {
                screen: Object.assign({}, state.screen, {
                    uploadToStorage: {
                        loading: false,
                    },
                    error: {
                        helpText: action.payload.error
                    }
                })
            })
        case 'GET_REGISTRATION_STATUS':
            return Object.assign({}, state, {
                kuwaId: Object.assign({}, state.kuwaId, {
                    registrationStatus: action.payload.registrationStatus
                })
            })
        case 'GET_KUWA_NETWORK':
            return Object.assign({}, state, {
                kuwaId: Object.assign({}, state.kuwaId, {
                    kuwaNetwork: action.payload.kuwaNetwork
                })
            })
        case 'PERSIST_STATE_TO_MOBILE':
        case 'PERSIST_STATE':
            return state;
        case 'CONVERT_WALLET_TO_BASE_64':
            return Object.assign({}, state, {
                loadedStateBase64: action.payload.walletBase64
            })
        case 'LOAD_STATE':
            return Object.assign({}, state, {
                loadedState: action.payload.loadedState
            })
        case 'RESTORE_STATE_PENDING':
            return state;
        case 'RESTORE_STATE_FULFILLED':
            return Object.assign({}, state, {
                kuwaId: Object.assign({}, state.kuwaId, {
                    registrationStatus: action.payload.registrationStatus,
                    kuwaNetwork: action.payload.kuwaNetwork,
                    privateKey: '0x' + action.payload.privateKey,
                    qrCodeSrc: action.payload.qrCodeSrc,
                    keyObject: action.payload.keyObject,
                    address:  '0x' + action.payload.address,
                    abi: action.payload.abi,
                    contractAddress: action.payload.contractAddress,
                    challenge: action.payload.challenge
                })
            })
        case 'RESTORE_STATE_REJECTED':
        case 'WALLET_NOT_FOUND':
        case 'WALLET_FOUND':
            return state;
        default:
            return state;
    }
}

export default kuwaReducer;