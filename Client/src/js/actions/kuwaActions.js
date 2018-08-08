import keythereum from 'keythereum';
import Web3 from 'web3';
import qrcode from 'qrcode';
import { push } from 'connected-react-router';

import { store } from '../store';

import { saveAs } from 'file-saver';

import config from 'config';

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config.web3Provider));

export function provideCredentials(kuwaPassword, passcode) {
    return dispatch => {
        dispatch({
            type: 'CREATE_KEYS_PENDING'
        })
        //defining parameters and options to create an ethereum wallet
        let params = { keyBytes: 32, ivBytes: 16 };
        let dk = keythereum.create(params);
        let options = {
            kdf: "pbkdf2", // or "scrypt" to use the scrypt kdf
            cipher: "aes-128-ctr",
            kdfparams: {
                c: 262144,
                dklen: 32,
                prf: "hmac-sha256"
            }
        };
        try {
            //The key object is generated using a combination of the kuwaPassword and private key. 
            keythereum.dump(kuwaPassword, dk.privateKey, dk.salt, dk.iv, options, keyObject => {
                keythereum.recover(kuwaPassword, keyObject, privateKey => {
                    let privateKeyInHex = privateKey.toString('hex');
                    generateQrCode('0x' + keyObject.address).then(qrCodeSrc => {
                        dispatch({
                            type: 'CREATE_KEYS_FULFILLED',
                            payload: {keyObject, privateKeyInHex, qrCodeSrc}
                        })
                        requestSponsorship(keyObject, privateKeyInHex, passcode, dispatch)
                    })
                })
            });
        } catch(e) {
            dispatch({
                type: 'CREATE_KEYS_REJECTED',
                payload: {
                    error: "There was an error creating your Kuwa ID. Please try again."
                }
            })
            dispatch(push('/Error'))
        }
    }
}

function requestSponsorship(keyObject, privateKey, passcode, dispatch) {
    //return dispatch => {
        dispatch({
            type: 'REQUEST_SPONSORSHIP_PENDING',
        })
        let formData = new FormData();
        formData.append('address', keyObject.address);
        formData.append('SS', passcode);
        fetch(config.requestUrl.requestSponsorshipUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(responseJson => {
                if (responseJson.message === 'invalid Shared Secret') {
                    dispatch({
                        type: 'REQUEST_SPONSORSHIP_REJECTED',
                        payload: { error: "Invalid Shared Secret." }
                    })
                    dispatch(push('/Error'))
                } else {
                    Promise.all([
                        getChallenge(responseJson.abi, responseJson.contractAddress, keyObject.address),
                        getRegistrationStatusString(responseJson.abi, responseJson.contractAddress, keyObject.address)
                    ])
                    .then(payload => {
                        dispatch({
                            type: 'REQUEST_SPONSORSHIP_FULFILLED',
                            payload: { 
                                challenge: payload[0],
                                registrationStatus: payload[1], 
                                responseJson 
                            }
                        })
                        dispatch(push('/RecordRegistrationVideo'))
                    })
                }
            })
        .catch(e => {
            dispatch({
                type: 'REQUEST_SPONSORSHIP_REJECTED',
                payload: { error: "Sorry, we are experiencing internal problems." }
            })
            dispatch(push('/Error'))
        })
    //}
}

export function uploadToStorage(videoFilePath, kuwaId, abi, contractAddress) {
    return dispatch => {
        dispatch({
            type: 'UPLOAD_TO_STORAGE_PENDING'
        })
        let formData = new FormData();
        new Promise((resolve, reject) => {
            resolveLocalFileSystemURL(videoFilePath, successOnFile, null)
            function successOnFile(fileEntry) {
                fileEntry.file(file => resolve(file));
            }
        }).then(file => {
            let reader = new FileReader();
            reader.readAsArrayBuffer(file);
            new Promise((resolve, reject) => {
                reader.onloadend = (e) => {
                    let videoBlob = new Blob([reader.result], { type:file.type});
                    resolve(videoBlob);
                }
            }).then(videoFile => {
                formData.append('ClientAddress',kuwaId);
                formData.append('ChallengeVideo',videoFile);
                formData.append('ContractABI',JSON.stringify(abi));
                formData.append('ContractAddress',contractAddress);
                fetch(config.requestUrl.uploadInformationUrl, {
                    method: 'POST',
                    body: formData
                }).then(response => {
                    setRegistrationStatusTo("Video Uploaded", contractAddress, abi, kuwaId)
                        .then(({ registrationStatus }) => {
                            dispatch({
                                type: 'UPLOAD_TO_STORAGE_FULFILLED',
                                payload: {
                                    response,
                                    registrationStatus
                                }
                            })
                            dispatch(push('/YourKuwaId'))
                        })
                }).catch(e => {
                    console.log(e)
                    dispatch({
                        type: 'UPLOAD_TO_STORAGE_REJECTED',
                        payload: { error: "Seems like the Information was not uploaded" }
                    })
                    dispatch(push('/Error'))
                })
            })
        })
    }
}

export function webUploadToStorage(videoBlob, kuwaId, abi, contractAddress) {
    return dispatch => {
        dispatch({
            type: 'WEB_UPLOAD_TO_STORAGE_PENDING'
        })
        let formData = new FormData();
        formData.append('ClientAddress',kuwaId);
        formData.append('ChallengeVideo',videoBlob);
        formData.append('ContractABI',JSON.stringify(abi));
        formData.append('ContractAddress',contractAddress);
        fetch(config.requestUrl.uploadInformationUrl, {
            method: 'POST',
            body: formData
        }).then(response => {
            setRegistrationStatusTo("Video Uploaded", contractAddress, abi, kuwaId)
                .then(({ registrationStatus }) => {
                    dispatch({
                        type: 'WEB_UPLOAD_TO_STORAGE_FULFILLED',
                        payload: {
                            response,
                            registrationStatus
                        }
                    })
                    dispatch(push('/YourKuwaId'))
                })
        }).catch(e => {
            console.log(e)
            dispatch({
                type: 'WEB_UPLOAD_TO_STORAGE_REJECTED',
                payload: { error: "Seems like the Information was not uploaded" }
            })
            dispatch(push('/Error'))
        })
    }
}

function generateQrCode(kuwaId) {
    let opts = {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        rendererOpts: {
            quality: 0.3
        }
    }

    return new Promise((resolve, reject) => {
        qrcode.toDataURL(kuwaId, opts, function (err, url) {
            if (err) throw reject(err);
            resolve(url);
        })
    })
}

export function setRegistrationStatusTo(registrationStatus, contractAddress, abi, kuwaId) {
    return getRegistrationStatusString(abi, contractAddress, kuwaId)
        .then(currentRegistrationStatus => {
            if (currentRegistrationStatus === "Valid" || currentRegistrationStatus === "Invalid") {
                return Promise.resolve({ responseJson:null, currentRegistrationStatus })
            } 
            let formData = new FormData();
            formData.append('registrationStatus', registrationStatus);
            formData.append('contractABI',JSON.stringify(abi));
            formData.append('contractAddress',contractAddress);

            return new Promise((resolve, reject) => {
                fetch(config.requestUrl.setRegistrationStatusToUrl, { method: 'POST', body: formData })
                    .then(response => response.json())
                    .then(responseJson => {
                        resolve({ responseJson, registrationStatus });
                    })
                    .catch(e => {
                        reject(JSON.stringify(e));
                    })
            })
        })
}

export function loadState(jsonFile) {
    return {
        type: 'LOAD_STATE',
        payload: { loadedState: jsonFile }
    }
}

export function restoreState(jsonFile, kuwaPassword) {
    return dispatch => {
        dispatch({
            type: 'RESTORE_STATE_PENDING'
        })

        let stateToRestore;
        getStateFromFile(jsonFile)
            .then(state => {
                stateToRestore = state;
                let keyObject = {
                    address: state.address,
                    crypto: state.crypto,
                    id: state.id,
                    version: state.version
                }
                return keyObject;
            })
            .then(keyObject => getPrivateKey(keyObject, kuwaPassword))
            .then(privateKeyInHex => Promise.all([
                    getRegistrationStatusString(stateToRestore.abi, stateToRestore.contractAddress, '0x' + stateToRestore.address),
                    getKuwaNetworkList(stateToRestore.abi, stateToRestore.contractAddress, '0x' + stateToRestore.address),
                    Promise.resolve(privateKeyInHex),
                    generateQrCode('0x' + stateToRestore.address),
                    Promise.resolve({
                        address: stateToRestore.address,
                        crypto: stateToRestore.crypto,
                        id: stateToRestore.id,
                        version: stateToRestore.version
                    }),
                    getChallenge(stateToRestore.abi, stateToRestore.contractAddress, '0x' + stateToRestore.address)
                ]))
            .then(payload => {
                dispatch({
                    type: 'RESTORE_STATE_FULFILLED',
                    payload: {
                        registrationStatus: payload[0],
                        kuwaNetwork: payload[1],
                        privateKey: payload[2],
                        qrCodeSrc: payload[3],
                        keyObject: payload[4],
                        address: stateToRestore.address,
                        abi: stateToRestore.abi,
                        contractAddress: stateToRestore.contractAddress,
                        challenge: payload[5]
                    }
                })
                dispatch(push('/YourKuwaId'))
            })
            .catch(error => alert("Your Kuwa password was wrong, please try again"))
    }
}

function getStateFromFile(jsonFile) {
    let reader = new FileReader();
    reader.readAsText(jsonFile);
    return new Promise((resolve, reject) => {
        reader.onloadend = e => {
            resolve(JSON.parse(reader.result))
        }
    });
}

function getPrivateKey(keyObject, kuwaPassword) {
    return new Promise((resolve, reject) => {
        keythereum.recover(kuwaPassword, keyObject, privateKey => {
            let privateKeyInHex = privateKey.toString('hex');
            if (privateKeyInHex === "Error: message authentication code mismatch") {
                reject(privateKeyInHex);
            } else {
                resolve(privateKeyInHex);
            }
        })
    })
}

export function persistState() {
    return dispatch => {
        let stateToPersist = JSON.stringify(getStateToPersist());
        let blob = new Blob([stateToPersist], {type : 'application/json'});
        saveAs(blob, "myWallet.json");
        dispatch({
            type: 'PERSIST_STATE'
        })
    }
}

function getStateToPersist() {
    let state = store.getState();
    return {
        address: state.kuwaReducer.kuwaId.keyObject.address,
        crypto: state.kuwaReducer.kuwaId.keyObject.crypto,
        id: state.kuwaReducer.kuwaId.keyObject.id,
        version: state.kuwaReducer.kuwaId.keyObject.version,
        contractAddress: state.kuwaReducer.kuwaId.contractAddress,
        abi: state.kuwaReducer.kuwaId.abi
    }
}

export function getRegistrationStatus(abi, contractAddress, kuwaId) {
    return dispatch => {
        getRegistrationStatusString(abi, contractAddress, kuwaId).then(registrationStatus => {
            dispatch({
                type: 'GET_REGISTRATION_STATUS',
                payload: { registrationStatus }
            })
        })
    }
}

export function getKuwaNetwork(abi, contractAddress, kuwaId) {
    return dispatch => {
        getKuwaNetworkList(abi, contractAddress, kuwaId).then(kuwaNetwork => {
            dispatch({
                type: 'GET_KUWA_NETWORK',
                payload: { kuwaNetwork }
            })
        })
    }
}

export function getKuwaNetworkList(abi, contractAddress, kuwaId) {
    return loadContract(abi, contractAddress, 4300000, '22000000000', kuwaId)
        .then(contract => contract.methods.getKuwaNetwork().call())
        .then(kuwaNetwork => Promise.resolve(kuwaNetwork))
}

export function getRegistrationStatusString(abi, contractAddress, kuwaId) {
    return loadContract(abi, contractAddress, 4300000, '22000000000', kuwaId)
        .then(contract => contract.methods.getRegistrationStatus().call())
        .then(registrationStatus => Promise.resolve(web3.utils.hexToUtf8(registrationStatus)))
}

export function getChallenge(abi, contractAddress, kuwaId) {
    return loadContract(abi, contractAddress, 4300000, '22000000000', kuwaId)
        .then(contract => contract.methods.getChallenge().call())
        .then(challenge => {
            if (challenge === 0) {
                setRegistrationStatusTo("Challenge Expired", contractAddress, abi, kuwaId)
                    .then(() => Promise.resolve(challenge))
            } else {
                Promise.resolve(challenge)
            }
        })
}

/**
 * Creates a wallet with the provided private key
 * @param  {string} privateKey 
 * @return {void}
 */
export const loadWallet = function(privateKey) {
    web3.eth.accounts.wallet.clear();
    web3.eth.accounts.wallet.add(privateKey);
}

/**
 * Loads a smart contract
 * @param  {JSON} abi 
 * @param  {string} contractAddress 
 * @param  {number} gas 
 * @param  {string} gasPrice 
 * @param  {string} from 
 * @return 
 */
export const loadContract = async function(abi, contractAddress, gas, gasPrice, from) {
    let contract = new web3.eth.Contract(abi);
    contract.options.address = contractAddress;
    contract.options.from = from;
    contract.options.gasPrice = gasPrice;
    contract.options.gas = gas;
    return contract;
}