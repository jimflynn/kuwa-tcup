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

export function mobileStartScanner() {
    return dispatch => {
        // Make the webview transparent so the video preview is visible behind it.
        QRScanner.show();
        document.getElementById("root").style.opacity = "0";
        document.body.style.backgroundColor = 'transparent';
        dispatch({
            type: 'QR_CODE_SCAN_PENDING'
        })
        QRScanner.scan(displayContents);
        
        function displayContents(err, kuwaId){
            QRScanner.hide(function() {
                QRScanner.destroy(function() {
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
                    setTimeout(function() { 
                        document.getElementById("root").style.opacity = "1";
                        document.body.removeAttribute("style");
                        document.documentElement.removeAttribute("style");
                    }, 500)
                })
            })
        }
    }
}