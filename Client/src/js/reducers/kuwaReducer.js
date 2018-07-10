import { 
    CREATE_KEYS,
    CREATE_KUWA_ID,
    REQUEST_SPONSORSHIP, 
    UPLOAD_INFO, 
    UNLOCK_KUWA_ID, 
    BACK } from '../actions/types';

const initialState = {
    currentKuwaId: "",
    kuwaIds: {},
    screen: {
        screenName:'SET_PASSWORD'
    }
}

const kuwaReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'CREATE_KEYS_PENDING':
            return Object.assign({}, state, {
                screen: {
                    screenName: "LOADING",
                    helpText: 'Generating Keys...'
                }
            })
        case 'CREATE_KEYS_FULFILLED':
            return Object.assign({}, state, {
                currentKuwaId: action.payload.identifier,
                kuwaIds: Object.assign({}, state.kuwaIds, {
                    [action.payload.identifier]: {
                        address: '0x' + action.payload.keyObject.address,
                        privateKey: '0x' + action.payload.privateKeyInHex,
                        keyObject: action.payload.keyObject,
                        sponsorship: "NOT_SPONSORED",
                        info_uploaded: false,
                        unlocked: false
                    }
                }),
                screen: Object.assign({}, state.screen, {
                    screenName: "REQUEST_SPONSORSHIP"
                })
            })
        case 'REQUEST_SPONSORSHIP_PENDING':
            return Object.assign({}, state, {
                screen: {
                    screenName: "LOADING",
                    helpText: 'Requesting Sponsorship. This may take several minutes...'
                }
            })
        case 'REQUEST_SPONSORSHIP_FULFILLED':
            return Object.assign({}, state, {
                kuwaIds: Object.assign({}, state.kuwaIds, {
                    [state.currentKuwaId]: Object.assign({}, state.kuwaIds[state.currentKuwaId], {
                        sponsorship: "SPONSORED",
                        unlocked: true,
                        contractAddress: action.payload.responseJson.contractAddress,
                        abi: action.payload.responseJson.abi,
                        challenge: action.payload.challenge
                    })
                }),
                screen: Object.assign({}, state.screen, {
                    screenName: "UPLOAD_TO_STORAGE"
                })
            })
        case 'REQUEST_SPONSORSHIP_REJECTED':
            return Object.assign({}, state, {
                screen: {
                    screenName: "REQUEST_SPONSORSHIP"
                }
            })
        case 'UPLOAD_TO_STORAGE_PENDING':
            return Object.assign({}, state, {
                screen: {
                    screenName: "LOADING",
                    helpText: 'Uploading Information. This may take several minutes...'
                }
            })
        case 'UPLOAD_TO_STORAGE_FULFILLED':
            return Object.assign({}, state, {
                screen: {
                    screenName: "LOADING",
                    helpText: 'Done'
                }
            })
        case 'UPLOAD_TO_STORAGE_REJECTED':
            return Object.assign({}, state, {
                screen: {
                    screenName: "UPLOAD_TO_STORAGE"
                }
            })
        default:
            return state;
    }
}

export default kuwaReducer;