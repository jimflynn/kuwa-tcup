import keythereum from 'keythereum';
import Web3 from 'web3';
import qrcode from 'qrcode';
import { push } from 'connected-react-router';

import { store } from '../store';

import { saveAs } from 'file-saver';

import config from 'config';

/**
 * Create a global variable for the web3
 * The provider is set using the config value
 */
let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config.web3Provider));

/**
 * Provide Credentials to create a Kuwa ID. The Client is required to provide a password to
 * encrypt his keypair (Kuwa ID and private key) and a passcode provided by the Sponsor.
 * With the provided kuwaPassword a keypair is generated using Keythereum (npm package).
 * First the CREATE_KEYS_PENDING actions is dispatched so that the Loading component is shown
 * on the Client while the keypair is generated. In case the keypair creation fails, the
 * Client will be taken to the Error screen and be asked to try again. Otherwise, the
 * CREATE_KEYS_FULFILLED action will be dispatched and the requestSponsorship function will
 * be called.
 * @export
 * @param  {string} kuwaPassword created by the Client
 * @param  {string} passcode provided (via email) by the Sponsor to the Client
 * @return {void}
 */
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
                        requestSponsorship(keyObject, passcode, dispatch)
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

/**
 * Request Sponsorship by sending the created keyObject that contains the kuwa ID (Etheruem
 * Address) of the Client and the passcode provided by the Sponsor to the Client.
 * It first dispatches the REQUEST_SPONSORSHIP_PENDING action so that the Loading component
 * appears on the Client's screen. Meanwhile, a POST request is sent to the Sponsor.
 * If an error occurs on the server (i.e. the server is down), the Error is caught and 
 * the Client is sent to the Error screen by dispatching REQUEST_SPONSORSHIP_REJECTED. 
 * If the passcode is wrong, the Client will be also be sent to the Error screen with a
 * different error message and the sponsorship will also be rejected. In case the passcode
 * is correct the Sponsor will deploy a Smart Contract for the Client. Once the Smart Contract
 * is deployed the REQUEST_SPONSORSHIP_FULFILLED action will be dispatched and the Client
 * will be taken to the RecordRegistrationVideo page. In case the Client is using the Cordova
 * app the state will be automatically persisted as well.
 * @param  {Object} keyObject containing the encrypted keypair of the Client
 * @param  {String} passcode provided (via email) by the Sponsor to the Client
 * @param  {Function} dispatch function used to dispatch actions to the store
 * @return {void}
 */
function requestSponsorship(keyObject, passcode, dispatch) {
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
            if (responseJson.abi) {
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
                    persistStateToMobile(dispatch);
                })
            } else {
                dispatch({
                    type: 'REQUEST_SPONSORSHIP_REJECTED',
                    payload: { error: responseJson.message }
                })
                dispatch(push('/Error'))
            }
        })
    .catch(e => {
        dispatch({
            type: 'REQUEST_SPONSORSHIP_REJECTED',
            payload: { error: "Sorry, we are experiencing internal problems." }
        })
        dispatch(push('/Error'))
    })
}

/**
 * Upload to storage the video with the recorded challenge phrase from the cordova app.
 * The function creates a file using the cordova-plugin-file so that it access the filesystem.
 * Then the file is used to create a blob which is apended to the formData object along
 * with the Kuwa ID, the contract abi, and the contract address so that a POST request can
 * be sent to the Storage Manager with this information. Before the blob is created and the
 * information is sent to the Storage Manager, the UPLOAD_TO_STORAGE_PENDING action is 
 * dispatched so that the Loading component is shown on the Client. In case the information
 * is not uploaded (i.e. the server is down), the UPLOAD_TO_STORAGE_REJECTED action will be
 * dispatched and the Client will be taken to the Error screen. Otherwise, the Storage
 * Manager will send a response and the UPLOAD_TO_STORAGE_FULFILLED action will be dispatched.
 * This will also persist the state to the mobile filesystem
 * @export
 * @param  {String} videoFilePath of the video recorded with the Challenge phrase
 * @param  {any} kuwaId of the Client
 * @param  {any} abi of the Contract
 * @param  {any} contractAddress address of the Contract created by the Sponsor for the Client
 * @return {void}
 */
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
                    // This Valid should be Video Uploaded
                    setRegistrationStatusTo("Valid", contractAddress, abi, kuwaId)
                        .then(({ registrationStatus }) => {
                            dispatch({
                                type: 'UPLOAD_TO_STORAGE_FULFILLED',
                                payload: {
                                    response,
                                    registrationStatus
                                }
                            })
                            dispatch(push('/YourKuwaId'))
                            persistStateToMobile(dispatch);
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

/**
 * Upload to storage the video with the recorded challenge phrase from the web client.
 * Using the video.js API a video is recorded on the Client which generates a blob.
 * This blob is apended to the formData object along
 * with the Kuwa ID, the contract abi, and the contract address so that a POST request can
 * be sent to the Storage Manager with this information. Before the blob is created and the
 * information is sent to the Storage Manager, the WEB_UPLOAD_TO_STORAGE_PENDING action is 
 * dispatched so that the Loading component is shown on the Client. In case the information
 * is not uploaded (i.e. the server is down), the WEB_UPLOAD_TO_STORAGE_REJECTED action will be
 * dispatched and the Client will be taken to the Error screen. Otherwise, the Storage
 * Manager will send a response and the WEB_UPLOAD_TO_STORAGE_FULFILLED action will be dispatched.
 * This will also persist the state to the mobile filesystem
 * @export
 * @param  {any} videoBlob created using video.js on the Client
 * @param  {any} kuwaId of the Client
 * @param  {any} abi of the Contract
 * @param  {any} contractAddress address of the Contract created by the Sponsor for the Client
 * @return {void}
 */
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
            // This Valid should be Video Uploaded
            setRegistrationStatusTo("Valid", contractAddress, abi, kuwaId)
                .then(({ registrationStatus }) => {
                    dispatch({
                        type: 'WEB_UPLOAD_TO_STORAGE_FULFILLED',
                        payload: {
                            response,
                            registrationStatus
                        }
                    })                    
                    fetch('https://alpha.kuwa.org:3000/getConfig/')
                        .then(a => a.json())
                        .then(json => {
                            if (json.message.Client.enableRegistrationCongrats) {
                                dispatch(push('/Success'))
                            } else {
                                dispatch(push('/YourKuwaId'))
                            }
                        })
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

/**
 * Generate the QR code that contains the Kuwa ID of the client by passing a string that 
 * contains the Kuwa ID
 * @param  {String} kuwaId of the Client
 * @return {Promise} that resolves to the url containing the URL of the image with the QR code. This URL can be used as src in an img tag.
 */
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

/**
 * Sets the registration status of the Client to whatever is passed in the registrationStatus
 * parameter. Setting the registration status is done by the Sponsor as it requires Ether
 * to update the smart contract. Therefore, the Client sends a request to the Sponsor so that
 * the Sponsor can do it on his behalf. In case the current registration status in the
 * Smart Contract is Valid or Invalid, no request is sent to the Sponsor. Otherwise,
 * the request is sent along with the contract address, its abi, and the Kuwa Id of the Client,
 * so that the Sponsor can load and update the registration status of the smart contract.
 * @export
 * @param  {string} registrationStatus new registration status to be set in the Smart Contract
 * @param  {string} contractAddress address of the Smart Contract
 * @param  {string} abi of the Smart Contract
 * @param  {string} kuwaId Kuwa ID of the Client
 * @return {void}
 */
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

/**
 * Loads the state of the application from a jsonFile which is the custom Wallet File.
 * @export
 * @param  {File} jsonFile that contains the Client's wallet information and the Smart Contract information
 * @return {void}
 */
export function loadState(jsonFile) {
    return {
        type: 'LOAD_STATE',
        payload: { loadedState: jsonFile }
    }
}

/**
 * Restores the state of the application using the wallet file contained in the jsonFile object.
 * The Kuwa Password created by the Client needs to be provided to unlock the wallet, otherwise,
 * the information will not be loaded. Before the information is loaded the RESTORE_STATE_PENDING
 * action is dispatched. Then the information is extracted from the json file and used to load
 * the Client's Smart Contract to get the current registration status.
 * @export
 * @param  {File} jsonFile that contains the Client's wallet information and the Smart Contract information
 * @param  {String} kuwaPassword created by the Client to encrypt the Wallet
 * @param  {Function} onSuccess is called if the correct password and everything is loaded properly
 * @return {void}
 */
export function restoreState(jsonFile, kuwaPassword, onSuccess) {
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
                onSuccess();
                convertToBase64(dispatch);
                if (payload[0] === "Credentials Provided") {
                    dispatch(push('/RecordRegistrationVideo'))
                } else {
                    dispatch(push('/YourKuwaId'))
                }
            })
            .catch(error => alert("Your Kuwa Password was wrong, please try again"))
    }
}

/**
 * Converts the jsonFile to json object
 * @param  {File} jsonFile that contains the Client's wallet information and the Smart Contract information
 * @return {Promise} that resolves to a json object
 */
function getStateFromFile(jsonFile) {
    let reader = new FileReader();
    reader.readAsText(jsonFile);
    return new Promise((resolve, reject) => {
        reader.onloadend = e => {
            resolve(JSON.parse(reader.result))
        }
    });
}

/**
 * Recovers private key using the Kuwa Password from the Key Object
 * @param  {Object} keyObject json containing the key pair information of the Client
 * @param  {String} kuwaPassword used by the Client to encrypt his Wallet (key pair)
 * @return {Promise} that resolves to the private key of the Client
 */
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

/**
 * Uses the file-saver package to save the custom Wallet in the Web Client to the computers'
 * filesystem. It dispatches the PERSIST_STATE action
 * @export
 * @return {void}
 */
export function persistState() {
    return dispatch => {
        let stateToPersist = JSON.stringify(getStateToPersist());
        let blob = new Blob([stateToPersist], {type : 'application/json'});
        saveAs(blob, config.walletName);
        dispatch({
            type: 'PERSIST_STATE'
        })
    }
}

/**
 * Converts any object to base 64. This function is used in the cordova app, so that the
 * Wallet can be sent via email, uploaded to the drive, sent via whatsapp, etc. This is
 * easier than trying to get the file from the phones filesystem and can be easily stored
 * in the store
 * @param  {Function} dispatch function to send actions to the Redux store.
 * @return {void}
 */
function convertToBase64(dispatch) {
    if (!window.usingCordova) return;

    let stateToPersist = JSON.stringify(getStateToPersist());
    let wallet = btoa(stateToPersist);
    let fileName = config.walletName;

    dispatch({
        type: 'CONVERT_WALLET_TO_BASE_64',
        payload: { walletBase64: "base64:" + escape(fileName) + "//" + wallet }
    })
}

/**
 * Persist the state of the application to the phone. In this case, the state is the custom
 * Wallet File. The function uses the cordova file plugin to access the filesystem of the
 * phone after a blob is created from the json object. Once the state is persisted the
 * action PERSIST_STATE_TO_MOBILE is dispatched
 * @export
 * @param  {Function} dispatch function to dispatch actions to the store
 * @return {void}
 */
export function persistStateToMobile(dispatch) {
    if (!window.usingCordova) return;
    let stateToPersist = JSON.stringify(getStateToPersist());
    let fileBlob = new Blob([stateToPersist], {type : 'application/json'});
    let fileName = config.walletName;

    convertToBase64(dispatch)

    new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, successOnFile, null)
        function successOnFile(directoryEntry) {
            directoryEntry.getFile(fileName, {create:true}, file => resolve(file));
        }
    })
    .then(file => {
        file.createWriter(fileWriter => {
            fileWriter.onwriteend = e => {
                dispatch({
                    type: 'PERSIST_STATE_TO_MOBILE'
                })
            }
            fileWriter.write(fileBlob);
        });
    })
}

/**
 * Restore state on mobile is a function that runs when the applications is first loaded to 
 * check if a state had been previously persisted in the phone. If no wallet is found the 
 * action WALLET_NOT_FOUND is dispatched, otherwise, the action WALLET_FOUND is dispatched
 * and the LOAD_STATE action places the jsonFile in the store so that the state can be restored
 * using the restoreState function
 * @export
 * @param  {Function} onSuccess Function called in case the Wallet is found
 * @return {void}
 */
export function restoreStateOnMobile(onSuccess) {
    return dispatch => {
        let fileName = config.walletName;
        new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory + fileName, successOnFile, failOnFile)
            function successOnFile(fileEntry) {
                fileEntry.file(file => resolve(file));
            }
            function failOnFile() {
                reject(false);
            }
        })
        .then(jsonFile => {
            dispatch({
                type: 'WALLET_FOUND'
            })
            dispatch({
                type: 'LOAD_STATE',
                payload: { loadedState: jsonFile }
            })
            onSuccess();
        })
        .catch(bool => {
            dispatch({
                type: 'WALLET_NOT_FOUND'
            })
        })
    }
}

/**
 * There is a lot of information in the store, however, only part of it is needed to restore
 * the application where the user last left it off. This function gets all the information
 * that is needed to persist in form of a JSON file. It contains the Custom Wallet
 * @return {JSON} Custom Wallet
 */
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

/**
 * Sends the wallet via email (or any other service available in the phone to share documents).
 * The function uses the cordova-plugin-email-composer and once the wallet is exported
 * the action MAIL_SENT is dispatched.
 * @export
 * @param  {any} loadedStateBase64 
 * @return {void}
 */
export function exportViaEmail(loadedStateBase64) {
    return dispatch => {
        cordova.plugins.email.open({
            attachments: [loadedStateBase64],
            subject: "My Wallet", // subject of the email
            body: "I'm sending you my wallet", // email body (for HTML, set isHtml to true)
            isHtml: false, // indicats if the body is HTML or plain text
        }, callback, null);
        function callback() {
            dispatch({
                type: 'MAIL_SENT'
            })
        }
    }
}

/**
 * Gets the registration status from the getRegistrationStatusString function and dispatches
 * the GET_REGISTRATION_STATUS action with the registration status as payload
 * @export
 * @param  {String} abi of the Smart Contract
 * @param  {String} contractAddress address of the Smart Contract
 * @param  {String} kuwaId of the Client
 * @return {void}
 */
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

/**
 * Gets the Kuwa Network (the scanned Kuwa IDs of the client) from the getKuwaNetworkList
 * function and dispatches the GET_KUWA_NETWORK action with the Kuwa Network as payload
 * @export
 * @param  {String} abi of the Smart Contract
 * @param  {String} contractAddress address of the Smart Contract
 * @param  {String} kuwaId of the Client
 * @return {void}
 */
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

/**
 * Gets the Kuwa Network List from the Smart Contract. Since this operation does not
 * require ether the values 4300000 and '22000000000' are not used and the Sponsor is not
 * needed.
 * @export
 * @param  {String} abi of the Smart Contract
 * @param  {String} contractAddress address of the Smart Contract
 * @param  {String} kuwaId of the Client
 * @return {void}
 */
export function getKuwaNetworkList(abi, contractAddress, kuwaId) {
    return loadContract(abi, contractAddress, 4300000, '22000000000', kuwaId)
        .then(contract => contract.methods.getKuwaNetwork().call())
        .then(kuwaNetwork => Promise.resolve(kuwaNetwork))
}

/**
 * Gets the Registration Status from the Smart Contract. Since this operation does not
 * require ether the values 4300000 and '22000000000' are not used and the Sponsor is not
 * needed.
 * @export
 * @param  {String} abi of the Smart Contract
 * @param  {String} contractAddress address of the Smart Contract
 * @param  {String} kuwaId of the Client
 * @return {void}
 */
export function getRegistrationStatusString(abi, contractAddress, kuwaId) {
    return loadContract(abi, contractAddress, 4300000, '22000000000', kuwaId)
        .then(contract => contract.methods.getRegistrationStatus().call())
        .then(registrationStatus => Promise.resolve(web3.utils.hexToUtf8(registrationStatus)))
}

/**
 * Gets the Challenge from the Smart Contract. Since this operation does not
 * require ether the values 4300000 and '22000000000' are not used and the Sponsor is not
 * needed. Also, in case the Smart Contract Challenge is expired the Client will ask the
 * Sponsor to update the Registration Status
 * @export
 * @param  {String} abi of the Smart Contract
 * @param  {String} contractAddress address of the Smart Contract
 * @param  {String} kuwaId of the Client
 * @return {void}
 */
export function getChallenge(abi, contractAddress, kuwaId) {
    return loadContract(abi, contractAddress, 4300000, '22000000000', kuwaId)
        .then(contract => contract.methods.getChallenge().call())
        .then(challenge => {
            if (challenge === 0) {
                return setRegistrationStatusTo("Challenge Expired", contractAddress, abi, kuwaId)
                    .then(() => Promise.resolve("Challenge Expired"))
            } else {
                return Promise.resolve(challenge)
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
 * @return {void}
 */
export const loadContract = async function(abi, contractAddress, gas, gasPrice, from) {
    let contract = new web3.eth.Contract(abi);
    contract.options.address = contractAddress;
    contract.options.from = from;
    contract.options.gasPrice = gasPrice;
    contract.options.gas = gas;
    return contract;
}