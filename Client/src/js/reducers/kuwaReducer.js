import { 
    CREATE_KEYS,
    CREATE_KUWA_ID,
    REQUEST_SPONSORSHIP, 
    UPLOAD_INFO, 
    UNLOCK_KUWA_ID, 
    BACK } from '../actions/types';
    
const initialState = {
    isMobile: window.usingCordova,
    kuwaId: {},
    screen: {
        setPassword: {loading: false},
        requestSponsorship: {loading: false},
        uploadToStorage: {loading: false},
        success: {helpText: ''},
        error: {helpText: ''},
        loading: {helpText: ''}
    }
}

const kuwaReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'CREATE_KEYS_PENDING':
            return Object.assign({}, state, {
                screen: Object.assign({}, state.screen, {
                    setPassword: {
                        loading: true
                    },
                    loading: {
                        helpText: 'Generating keys...'
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
                    info_uploaded: false,
                    unlocked: false,
                    qrCodeSrc: action.payload.qrCodeSrc
                }),
                screen: Object.assign({}, state.screen, {
                    setPassword: {
                        loading: false
                    }
                })
            })
        case 'REQUEST_SPONSORSHIP_PENDING':
            return Object.assign({}, state, {
                screen: Object.assign({}, state.screen, {
                    requestSponsorship: {
                        loading: true
                    },
                    loading: {
                        helpText: 'Requesting Sponsorship. This may take several minutes...'
                    }
                })
            })
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
                    requestSponsorship: {
                        loading: false
                    }
                })
            })
        case 'REQUEST_SPONSORSHIP_REJECTED':
            return Object.assign({}, state, {
                screen: Object.assign({}, state.screen, {
                    requestSponsorship: {
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
                    },
                    loading: {
                        helpText: 'Uploading Information. This may take several minutes...'
                    }
                })
            })
        case 'UPLOAD_TO_STORAGE_FULFILLED':
        case 'WEB_UPLOAD_TO_STORAGE_FULFILLED':
            return Object.assign({}, state, {
                kuwaId: Object.assign({}, state.kuwaId, {
                    info_uploaded: true
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