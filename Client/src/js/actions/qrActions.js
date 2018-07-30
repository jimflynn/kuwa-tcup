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
            if (isValidKuwaId(kuwaId)) {
                dispatch({
                    type: 'QR_CODE_FOUND',
                    payload: { kuwaId }
                })
            } else {
                dispatch({
                    type: 'QR_CODE_INVALID'
                })
            }
        })
    }
}

function isValidKuwaId(kuwaId) {
    if (typeof kuwaId === 'string' || kuwaId instanceof String) {
        if(kuwaId.length === 42 && kuwaId.startsWith("0x")) return true;
    }
    return false;
}

export function stopScanner(scanner) {
    return dispatch => {
        scanner.stop().then(() => {
            dispatch({
                type: 'QR_CODE_STOP_SCAN'
            })
        })
    }
}

function stopScan(dispatch) {
    return function() {
        QRScanner.hide(function() {
            QRScanner.destroy(function() {
                dispatch({
                    type: 'QR_CODE_STOP_SCAN'
                })
                setTimeout(function() { 
                    document.body.style.backgroundColor = 'white';
                    document.documentElement.removeAttribute("style");
                    document.removeEventListener("backbutton", stopScan(dispatch), true);
                }, 500)
            })
        })
    }
}

export function mobileStartScanner() {
    return dispatch => {
        document.addEventListener("backbutton", stopScan(dispatch), true);
        // Make the webview transparent so the video preview is visible behind it.
        QRScanner.show();
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
                        document.body.style.backgroundColor = 'white';
                        document.documentElement.removeAttribute("style");
                        document.addEventListener("backbutton", stopScan(dispatch), true);
                    }, 500)
                })
            })
        }
    }
}