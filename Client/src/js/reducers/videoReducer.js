const initialState = {
    videoFilePath: "",
    videoStatus: "waiting",
    videoError: "",
    videoBlob: {}
}

const videoReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'WEB_CAPTURE_VIDEO_PENDING':
            return initialState;
        case 'WEB_CAPTURE_VIDEO_FULFILLED':
            return Object.assign({}, state, {
                videoBlob: action.payload.videoBlob,
                videoStatus: "success"
            })
        case 'CAPTURE_VIDEO_PENDING':
            return initialState;
        case 'CAPTURE_VIDEO_FULFILLED':
            return Object.assign({}, state, {
                videoFilePath: action.payload.videoFilePath,
                videoStatus: "success",
            })
        case 'CAPTURE_VIDEO_REJECTED':
        case 'WEB_CAPTURE_VIDEO_REJECTED':
            return Object.assign({}, state, {
                videoStatus: "failure",
                videoError: action.payload.videoError
            })
        default:
            return state;
    }
}

export default videoReducer;