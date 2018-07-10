
export function captureVideo() {
    return dispatch => {

        dispatch({
            type: 'CAPTURE_VIDEO_PENDING'
        })

        let options = {
            limit: 1,   // Max number of video clips in a single capture operation
            duration: 15,    // Max duration of each video clip
            quality: 1  // 0 means low quality, 1 means high quality
        };

        navigator.device.capture.captureVideo(captureSuccess, captureError, options);

        function captureSuccess(s) {
            dispatch({
                type: 'CAPTURE_VIDEO_FULFILLED',
                payload: {
                    videoFilePath: s[0].fullPath
                }
            })
        }

        function captureError(err) {
            let error = JSON.stringify(err);
            dispatch({
                type: 'CAPTURE_VIDEO_REJECTED',
                payload: {
                    error
                }
            })
        }
    }
}