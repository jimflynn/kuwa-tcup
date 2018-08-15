/*
   Watcher implementation in Node JS.
   */

var fs         = require('fs');
var mysql      = require('mysql');
var crypto     = require('crypto');
var chokidar   = require('chokidar');
var sprintf    = require("sprintf-js").sprintf;
var path       = require('path');
var Web3       = require('web3');
var web3       = new Web3('https://rinkeby.infura.io/8Dx9RdhjqIl1y3EQzQpl');
var keythereum = require('keythereum');

var properties = fs.readFileSync("./properties.json", "utf-8");
properties     = JSON.parse(properties);

var walletPath     = properties.walletPath;
var walletAddress  = "0x" + properties.accountAddress.toString("hex");
var walletPassword = properties.password;
var walletNonce    = 0;

var dict = {};

// load a smart Contract
var loadContract = async function(ContractABI, ContractAddress, from, gasPrice, gas) {
    let contract = new web3.eth.Contract(ContractABI);
    contract.options.address = ContractAddress;
    contract.options.from = from;
    contract.options.gasPrice = gasPrice;
    contract.options.gas = gas;
    // console.log(contract);
    return contract;
}

// load a wallet from the file
var loadWallet = async function (walletPath, accountAddress, password) {
    web3.eth.accounts.wallet.clear();
    var keyObject = keythereum.importFromFile(accountAddress, walletPath);
    var privateKey = keythereum.recover(properties.password, keyObject);
    privateKey = "0x" + privateKey.toString("hex");
    web3.eth.accounts.wallet.add(privateKey);
}

// get challenge phrase from a smart contract
var getChallengePhrase = async function(smartContract) {
    console.log('Getting Phrase...');
    try {
        let phrase = smartContract.methods.getChallenge().call();
        return phrase;
    }
    catch(error) {
        console.log("ERROR in getChallengePhrase: " + error.message);
    }
}

// mark an ID as VALID
var validateKuwaID = async function(senderAddress, ContractAddress, smartContract, gasLimit, gasPrice) {
    console.log('Sending Transaction...');
    // await smartContract.methods.markAsValid().send({from: senderAddress, gas: gasLimit, gasPrice: gasPrice});
    try {
        let receipt = smartContract
                        .methods
                        .setRegistrationStatusTo(web3.utils.utf8ToHex("Valid"))
                        .send({from: senderAddress, 
                            gas: gasLimit, 
                            gasPrice: gasPrice, 
                            nonce: walletNonce
                        });
        walletNonce = walletNonce + 1;
        return receipt;
    }
    catch(error) {
        console.log("ERROR in validateKuwaID: ", error.message);
    }
}

// mark an ID as INVALID
var inValidateKuwaID = async function(senderAddress, ContractAddress, smartContract, gasLimit, gasPrice) {
    console.log('Sending Transaction...');
    // await smartContract.methods.markAsInvalid().send({from: senderAddress, gas: gasLimit, gasPrice: gasPrice});
    try {
        let receipt = smartContract
                        .methods
                        .setRegistrationStatusTo(web3.utils.utf8ToHex("Invalid"))
                        .send({from: senderAddress, 
                            gas: gasLimit, 
                            gasPrice: gasPrice, nonce: walletNonce
                        });
        walletNonce = walletNonce + 1;
        return receipt;
    }
    catch(error) {
        console.log("ERROR in inValidateKuwaID: ", error.message);
    }
}

// get the registration Status of a Contract
var getStatus = async function(smartContract) {
    console.log('Getting Status...');
    return smartContract.methods.getRegistrationStatus().call();
}

// function to find duplicate
var findDuplicate = function(mapping, hashval) {
    for (var key in mapping) {
        if (mapping[key] === hashval)
            return true;
    }
    return false;
}

// used to connect to DB
let pool = mysql.createPool({
    connectionLimit : 100,
    host: "localhost",
    user: "moe",
    password: "Moe@Alpha123",
    database: "alpha_kuwa_registrar_moe",
    timezone : '-04:00',
    dateStrings : true
});

// function to insert row in DB
var insertRow = function(ClientAddress, ContractAddress, regStatus) {
    let command = sprintf(
            `INSERT INTO registration (client_address, contract_address, status) VALUES ('%s', '%s', '%s') ON DUPLICATE KEY UPDATE client_address='%s', contract_address='%s', status='%s';`,
            ClientAddress, ContractAddress, regStatus, ClientAddress, ContractAddress, regStatus);
    pool.getConnection((error, connection) => {
        if(error) {
            console.log("Error in insertRow - " + ClientAddress);
            console.log(error.message);
        }
        connection.query(command, (error, result) => {
            console.log("Watcher connected to DB.");
            if(!error) {
                console.log("Record inserted - " + ClientAddress);
            }
            else {
                console.log("Error in inserting record.");
            }
        });
        connection.release();
    });
}

// add Wallet to be able to conduct transactions
loadWallet(walletPath, walletAddress, walletPassword).then(() => {
    console.log("Wallet loaded.");
});

// get wallet Nonce
web3.eth.getTransactionCount(walletAddress)
.then((nonce) => {
    walletNonce = nonce;
    console.log("Nonce = ", walletNonce);
});

// Start watching desired directory
dir = '/registrations';
chokidar.watch(dir, {persistent: true}).on('all', registerFile);

async function registerFile(event, filePath) {
    if(event == 'add' && (path.basename(filePath) == 'info.json')) {
        try {
            let info = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            let ContractABI = JSON.parse(info.ContractABI);
            let ClientAddress = info.ClientAddress;
            let ContractAddress = info.ContractAddress;

            let smartContract = await loadContract(ContractABI, ContractAddress, walletAddress, "50000000000", "60000");
            console.log("Smart Contract generated.");
            let initialStatus = await getStatus(smartContract, ContractAddress);
            initialStatus = web3.utils.hexToUtf8(initialStatus);

            if(initialStatus === "Video Uploaded") {
                let hash = '';
                let sha = crypto.createHash('sha256');
                let file = fs.readFileSync(path.dirname(filePath) + '/' + 'ChallengeVideo.mp4');
                sha.update(file);
                hash = sha.digest('hex');
                let duplicate = findDuplicate(dict, hash);
                console.log('Duplicate File? :', duplicate);

                if(!duplicate) {
                    dict[filePath] = hash;
                    let challengePhrase = await getChallengePhrase(smartContract);
                    console.log("challengePhrase = ", challengePhrase);
                    let receipt = await validateKuwaID(walletAddress, ContractAddress, smartContract, "60000", "50000000000");
                    console.log("Receipt = ", receipt);
                    let regStatus = await getStatus(smartContract, ContractAddress);
                    regStatus = web3.utils.hexToUtf8(regStatus);
                    console.log("Registration Status of " + ClientAddress + " = " + regStatus);
                    insertRow(ClientAddress, ContractAddress, regStatus);
                }
                else {
                    let challengePhrase = await getChallengePhrase(smartContract);
                    console.log("challengePhrase = ", challengePhrase);
                    let receipt = await inValidateKuwaID(walletAddress, ContractAddress, smartContract, "60000", "50000000000");
                    console.log(receipt);
                    let regStatus = await getStatus(smartContract, ContractAddress);
                    regStatus = web3.utils.hexToUtf8(regStatus);
                    console.log("Registration Status of " + ClientAddress + " = " + regStatus);
                    insertRow(ClientAddress, ContractAddress, regStatus);
                }
            }
        }
        catch(error) {
            console.log("ERROR in RegisterFile: " + error.message);
        }
    }
}
