/**
 * Captures the video in the cordova app using cordova-plugin-media-capture.
 * It first dispatches the CAPTURE_VIDEO_PENDING action to the store while the Client
 * records the Challenge phrase. Once the capture finishes the captureSucess method is
 * called and the CAPTURE_VIDEO_FULFILLED action is dispatched along with the fullpath
 * of the location of the video in the phone. In case the recording fails, the
 * CAPTURE_VIDEO_REJECTED action will be dispatched with the error object as payload
 * @export
 * @return {void}
 */
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
            let videoError = JSON.stringify(err);
            dispatch({
                type: 'CAPTURE_VIDEO_REJECTED',
                payload: {
                    videoError
                }
            })
        }
    }
}

/**
 * Starts video on the Web Client
 * @export
 * @return {void}
 */
export function webStartVideo() {
    return {
        type: 'WEB_CAPTURE_VIDEO_PENDING'
    }
}

/**
 * Dispathces the WEB_CAPTURE_VIDEO_FULFILLED action with the recorded videoBlob as parameter
 * from the Web Client
 * @export
 * @param  {Blob} videoBlob 
 * @return {void}
 */
export function webFinishedVideo(videoBlob) {
    return {
        type: 'WEB_CAPTURE_VIDEO_FULFILLED',
        payload: {
            videoBlob
        }
    }
}

/**
 * In case the video in the web fails, the WEB_CAPTURE_VIDEO_REJECTED action will be dispatched
 * with the video error as payload
 * @export
 * @param  {Object} videoError containing the information of why the video failed
 * @return {void}
 */
export function webErrorVideo(videoError) {
    videoError = JSON.stringify(videoError);
    return {
        type: 'WEB_CAPTURE_VIDEO_REJECTED',
        payload: {
            videoError
        }
    }
}