import Instascan from 'instascan';
let QRScanner = window.QRScanner;

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

export function mobileStartScanner(scanner) {
    return dispatch => {
        // Make the webview transparent so the video preview is visible behind it.
        // QRScanner.show();
        document.getElementById("root").style.opacity = "0.0";
        document.body.style.backgroundColor = 'transparent';
        // Be sure to make any opaque HTML elements transparent here to avoid
        // covering the video.
        dispatch({
            type: 'QR_CODE_SCAN_PENDING'
        })
        // Start a scan. Scanning will continue until something is detected or
        // `QRScanner.cancelScan()` is called.
        QRScanner.scan(displayContents);
        
        function displayContents(err, kuwaId){
            document.getElementById("root").style.opacity = "";
            document.body.style.backgroundColor = '';
            if(err){
                dispatch({
                    type: 'QR_CODE_ERROR',
                    payload: {
                        qrError: err
                    }
                })
            } else {
                // The scan completed, display the contents of the QR code:
                dispatch({
                    type: 'QR_CODE_FOUND',
                    payload: { kuwaId }
                })
            }
        }
    }
}