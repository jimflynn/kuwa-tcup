const initialState = {
    scannedKuwaId: "",
    qrStatus: "Waiting",
    scanner: {}
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
            return Object.assign({}, state, {
                scannedKuwaId: action.payload.scannedKuwaId,
                qrStatus: "Found"
            })
        case 'QR_CODE_UPLOADED':
            return Object.assign({}, state, {
                qrStatus: "Uploaded"
            })
        case 'QR_CODE_STOP_SCAN':
            return Object.assign({}, state, {
                qrStatus: "Waiting"
            })
        case 'QR_CODE_INVALID':
            return Object.assign({}, state, {
                qrStatus: "Invalid"
            })
        default:
            return state;
    }
}

export default qrReducer;