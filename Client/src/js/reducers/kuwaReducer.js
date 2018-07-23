import { 
    CREATE_KEYS,
    CREATE_KUWA_ID,
    REQUEST_SPONSORSHIP, 
    UPLOAD_INFO, 
    UNLOCK_KUWA_ID, 
    BACK } from '../actions/types';
    
const initialState = {
    usingCordova: window.usingCordova,
    kuwaId: {
        address: "Your Kuwa ID has not been generated.",
        challenge: "You need to be sponsored to get a challenge number."
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
                currentKuwaId: action.payload.identifier,
                kuwaId: Object.assign({}, state.kuwaId, {
                    address: '0x' + action.payload.keyObject.address,
                    privateKey: '0x' + action.payload.privateKeyInHex,
                    keyObject: action.payload.keyObject,
                    sponsorship: "NOT_SPONSORED",
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
                    sponsorship: "SPONSORED",
                    unlocked: true,
                    contractAddress: action.payload.responseJson.contractAddress,
                    abi: action.payload.responseJson.abi,
                    challenge: action.payload.challenge
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
                    infoUploaded: true
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
        default:
            return state;
    }
}

export default kuwaReducer;