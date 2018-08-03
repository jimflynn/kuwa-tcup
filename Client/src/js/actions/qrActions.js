import Instascan from 'instascan';
let QRScanner = window.QRScanner;

import config from 'config';
import { loadContract, getKuwaNetworkList } from './kuwaActions';

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
                            addScannedKuwaId(scannedKuwaId, contractAddress, abi, kuwaId)
                            .then(responseJson => {
                                console.log(responseJson);
                                dispatch({
                                    type: 'QR_CODE_UPLOADED'
                                })
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

function isValidKuwaId(scannedKuwaId) {
    if (typeof scannedKuwaId === 'string' || scannedKuwaId instanceof String) {
        if(scannedKuwaId.length === 42 && scannedKuwaId.startsWith("0x")) return true;
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
                                    addScannedKuwaId(scannedKuwaId, contractAddress, abi, kuwaId)
                                    .then(responseJson => {
                                        console.log(responseJson);
                                        dispatch({
                                            type: 'QR_CODE_UPLOADED'
                                        })
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

function checkIfDuplicate(scannedKuwaId, contractAddress, abi, kuwaId) {
    loadContract(abi, contractAddress, 4300000, '22000000000', kuwaId).then(contract => {
        contract.methods.getChallenge().call().then(kuwaNetwork => {
            console.log("Kuwa Network", kuwaNetwork)
            if (kuwaNetwork.includes(scannedKuwaId)) {
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
        })
    })
    // return Promise.resolve(true);
}

function addScannedKuwaId(scannedKuwaId, contractAddress, abi, kuwaId) {
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