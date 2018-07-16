import Instascan from 'instascan';

export function startScanner(scanner) {
    return dispatch => {
        Instascan.Camera.getCameras().then(function (cameras) {
            if (cameras.length > 0) {
                console.log(scanner)
                scanner.start(cameras[0]);
                dispatch({
                    type: 'QR_CODE_SCAN_PENDING'
                })
            } else {
                dispatch({
                    type: 'QR_CODE_ERROR',
                    payload: {
                        qrError: 'No cameras found.'
                    }
                })
            }
        })
    }
}

export function qrCodeFound(kuwaId, scanner) {
    return dispatch => {
        scanner.stop().then(() => {
            dispatch({
                type: 'QR_CODE_FOUND',
                payload: { kuwaId }
            })
        })
    }
}