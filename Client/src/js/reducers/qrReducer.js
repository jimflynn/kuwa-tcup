const initialState = {
    kuwaNetwork: [],
    qrStatus: ""
}

const qrReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'QR_CODE_SCAN_PENDING':
            return Object.assign({}, state, {
                qrStatus: "Scanning"
            })
        case 'QR_CODE_ERROR':
            return Object.assign({}, state, {
                qrStatus: action.payload.qrError
            })
        case 'QR_CODE_FOUND':
            if (state.kuwaNetwork.find(kuwaId => kuwaId === state.payload.kuwaId)) {
                return state;
            }
            return Object.assign({}, state, {
                kuwaNetwork: state.kuwaNetwork.concat([state.payload.kuwaId])
            })
        default:
            return state;
    }
}

export default qrReducer;