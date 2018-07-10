const initialState = {
    videoFilePath: "",
    videoStatus: "waiting",
    videoError: ""
}

const videoReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'CAPTURE_VIDEO_PENDING':
            return initialState;
        case 'CAPTURE_VIDEO_FULFILLED':
            return Object.assign({}, state, {
                videoFilePath: action.payload.videoFilePath,
                videoStatus: "success",
            })
            case 'CAPTURE_VIDEO_REJECTED':
            return Object.assign({}, state, {
                videoStatus: "failure",
                videoError: action.payload.error
            })
        default:
            return state;
    }
}

export default videoReducer;