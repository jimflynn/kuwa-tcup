import Instascan from 'instascan';
let QRScanner = window.QRScanner;

import config from 'config';
import { getKuwaNetworkList, setRegistrationStatusTo } from './kuwaActions';

/**
 * Starts the scanner on the Web client using Instascan package.
 * @export
 * @param  {Object} scanner object created to start the camera on the web client
 * @return {void}
 */
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

/**
 * This function is called once a valid QR code containing a Kuwa ID is found and adds the new
 * Kuwa ID to the Kuwa Network. Before adding the QR code, the scanned code is checked to see
 * if it is valid. If it's not valid the action QR_CODE_INVALID is dispatched, otherwise,
 * QR_CODE_FOUND actions id dispatched. After that, it is checked if the scanned Kuwa ID
 * is not already in the Kuwa Network. The scanned Kuwa ID is only added if it is not
 * already in the Kuwa Network. In either case the QR_CODE_UPLOADED action is dispatched.
 * However, in case it is a new Kuwa ID the QR Code Scanned registration status is also
 * updated.
 * @export
 * @param  {String} scannedKuwaId Scanned Kuwa ID
 * @param  {Object} scanner object created to start the camera on the web client
 * @param  {String} contractAddress Address of the Smart Contract
 * @param  {String} abi of the Smart Contract
 * @param  {String} kuwaId of the Client Address
 * @return 
 */
export function qrCodeFound(scannedKuwaId, scanner, contractAddress, abi, kuwaId) {
    return dispatch => {
        scanner.stop().then(() => {
            if (isValidKuwaId(scannedKuwaId)) {
                dispatch({
                    type: 'QR_CODE_FOUND',
                    payload: { scannedKuwaId }
                })
                getKuwaNetworkList(abi, contractAddress, kuwaId)
                    .then(kuwaNetwork => {
                        if (kuwaNetwork.map(n => n.toUpperCase()).includes(scannedKuwaId.toUpperCase())) {
                            dispatch({
                                type: 'QR_CODE_UPLOADED'
                            })
                        } else {
                            addScannedKuwaId(scannedKuwaId, contractAddress, abi)
                            .then(responseJson => {
                                setRegistrationStatusTo("QR Code Scanned", contractAddress, abi, kuwaId).then(() => { dispatch({ type: 'QR_CODE_UPLOADED' }) })
                            })
                        }
                    })
            } else {
                dispatch({
                    type: 'QR_CODE_INVALID'
                })
            }
        })
    }
}

/**
 * Check if the scanned QR code is a Kuwa ID. It first checks that it's a string. It has
 * to be 42 characters long including the "0x" at the beginning.
 * @param  {any} scannedKuwaId 
 * @return {boolean}
 */
function isValidKuwaId(scannedKuwaId) {
    if (typeof scannedKuwaId === 'string' || scannedKuwaId instanceof String) {
        if(scannedKuwaId.length === 42 && scannedKuwaId.startsWith("0x")) return true;
    }
    return false;
}

/**
 * Stops the web QR scanner and dispatches QR_CODE_STOP_SCAN. This method is called in the
 * callback once a QR code is found.
 * @export
 * @param  {Object} scanner object created to start the camera on the web client
 * @return {void}
 */
export function stopScanner(scanner) {
    return dispatch => {
        scanner.stop().then(() => {
            dispatch({
                type: 'QR_CODE_STOP_SCAN'
            })
        })
    }
}

/**
 * Stops the scan of the QR scanner on the cordova app and restores the background color.
 * The removeEventListener is supposed to give back the original functionality to back
 * button on the phone, but so far it does not work properly. Once the QR scanner is stopped
 * the action QR_CODE_STOP_SCAN is dispatched.
 * @param  {Function} dispatch function to dispatch actions to the store
 * @return {Function}
 */
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

/**
 * Starts the Scanner on the cordova app. It first dispatches the action QR_CODE_SCAN_PENDING
 * after adding the stopScan event listener to the back button of the phone. Therefore,
 * if the Client clicks the back button on the phone the scan is stopped.
 * Once a valid QR code containing a Kuwa ID is found and adds the new
 * Kuwa ID to the Kuwa Network. Before adding the QR code, the scanned code is checked to see
 * if it is valid. If it's not valid the action QR_CODE_INVALID is dispatched, otherwise,
 * QR_CODE_FOUND actions id dispatched. After that, it is checked if the scanned Kuwa ID
 * is not already in the Kuwa Network. The scanned Kuwa ID is only added if it is not
 * already in the Kuwa Network. In either case the QR_CODE_UPLOADED action is dispatched.
 * However, in case it is a new Kuwa ID the QR Code Scanned registration status is also
 * updated.
 * @export
 * @param  {String} contractAddress address of the Smart Contract
 * @param  {String} abi of the Smart Contract
 * @param  {String} kuwaId of the Client
 * @return {void}
 */
export function mobileStartScanner(contractAddress, abi, kuwaId) {
    return dispatch => {
        document.addEventListener("backbutton", stopScan(dispatch), true);
        // Make the webview transparent so the video preview is visible behind it.
        QRScanner.show();
        document.body.style.backgroundColor = 'transparent';
        dispatch({
            type: 'QR_CODE_SCAN_PENDING'
        })
        QRScanner.scan(displayContents);
        
        function displayContents(err, scannedKuwaId){
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
                        dispatch({
                            type: 'QR_CODE_FOUND',
                            payload: { scannedKuwaId }
                        })
                        getKuwaNetworkList(abi, contractAddress, kuwaId)
                            .then(kuwaNetwork => {
                                if (kuwaNetwork.map(n => n.toUpperCase()).includes(scannedKuwaId.toUpperCase())) {
                                    dispatch({
                                        type: 'QR_CODE_UPLOADED'
                                    })
                                } else {
                                    addScannedKuwaId(scannedKuwaId, contractAddress, abi)
                                    .then(responseJson => {
                                        setRegistrationStatusTo("QR Code Scanned", contractAddress, abi, kuwaId).then(() => { dispatch({ type: 'QR_CODE_UPLOADED' }) })
                                    })
                                }
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

/**
 * This method requests the Sponsor to add a scanned Kuwa ID to the Kuwa Network of the Client
 * in the Smart Contract. Since the Sponsor needs to load the contract, the ABI and the
 * Contract Address need to be sent along with the scanned Kuwa ID.
 * @param  {String} scannedKuwaId Scanned Kuwa ID to be added in the Kuwa Network
 * @param  {any} contractAddress address of the Smart Contract
 * @param  {any} abi of the Smart Contract
 * @return {void}
 */
function addScannedKuwaId(scannedKuwaId, contractAddress, abi) {
    let formData = new FormData();
    formData.append('scannedKuwaId', scannedKuwaId);
    formData.append('contractABI',JSON.stringify(abi));
    formData.append('contractAddress',contractAddress);

    return new Promise((resolve, reject) => {
        fetch(config.requestUrl.addScannedKuwaIdUrl, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(responseJson => {
                resolve(responseJson);
            })
            .catch(e => {
                reject(JSON.stringify(e));
            })
    })
}