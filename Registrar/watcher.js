/*
Watcher implementation in Node JS.
*/

var fs = require('fs');
var mysql = require('mysql');
var crypto = require('crypto');
var chokidar = require('chokidar');
var sprintf = require("sprintf-js").sprintf;
var path = require('path');
var Web3 = require('web3');
var web3 = new Web3('https://rinkeby.infura.io/8Dx9RdhjqIl1y3EQzQpl');
var keythereum = require('keythereum');

var properties = fs.readFileSync("./properties.json", "utf-8");
properties = JSON.parse(properties);

var walletPath = properties.walletPath;
var walletAddress = "0x" + properties.accountAddress.toString("hex");
var walletPassword = properties.password;
var walletNonce = 0;

var dict = {};
var queue = [];


var loadContract = async function(ContractABI, ContractAddress, from, gasPrice, gas) {
	let contract = new web3.eth.Contract(ContractABI);
	contract.options.address = ContractAddress;
	contract.options.from = from;
	contract.options.gasPrice = gasPrice;
	contract.options.gas = gas;
	// console.log(contract);
	return contract;
}

var loadWallet = async function (walletPath, accountAddress, password) {
	web3.eth.accounts.wallet.clear();
	var keyObject = keythereum.importFromFile(accountAddress, walletPath);
	var privateKey = keythereum.recover(properties.password, keyObject);
	privateKey = "0x" + privateKey.toString("hex");
	web3.eth.accounts.wallet.add(privateKey);
}

var getChallengePhrase = async function(smartContract) {
    console.log('Getting Phrase...');
	let phrase = await smartContract.methods.getChallenge().call();
	return phrase;
}

var validateKuwaID = async function(senderAddress, ContractAddress, smartContract, gasLimit, gasPrice) {
    console.log('Sending Transaction...');
	// await smartContract.methods.markAsValid().send({from: senderAddress, gas: gasLimit, gasPrice: gasPrice});
	let receipt = smartContract.methods.markAsValid().send({from: senderAddress, 
                                                            gas: gasLimit, 
                                                            gasPrice: gasPrice, nonce: walletNonce});
    walletNonce = walletNonce + 1;
    return receipt;
}

var inValidateKuwaID = async function(senderAddress, ContractAddress, smartContract, gasLimit, gasPrice) {
    console.log('Sending Transaction...');
	// await smartContract.methods.markAsInvalid().send({from: senderAddress, gas: gasLimit, gasPrice: gasPrice});
	let receipt = smartContract.methods.markAsInvalid().send({from: senderAddress, 
                                                              gas: gasLimit, 
                                                              gasPrice: gasPrice, nonce: walletNonce});
    walletNonce = walletNonce + 1;
    return receipt;
}

var getStatus = async function(smartContract) {
    console.log('Getting Status...');
    return smartContract.methods.getRegistrationStatus().call();
}

var findDuplicate = function(mapping, hashval) {
	for (var key in mapping) {
		if (mapping[key] === hashval)
			return true;
	}
	return false;
}

let pool = mysql.createPool({
	host: "localhost",
	user: "root",
	// password: "sqlpassword",
	password: String.raw`(-h(3~8u"_ZE{lV%m(2SWze$F-7K<$,ej:2+@=-O\43**|>j6!2~uPmeJko[ASo=`,
	database: "alpha_kuwa_registrar_moe",
	timezone : '-04:00',
	dateStrings : true
});

var insertRow = function(ClientAddress, ContractAddress, regStatus) {
	let command = sprintf(
		`INSERT INTO registration (client_address, contract_address, status) VALUES ('%s', '%s', %d) ON DUPLICATE KEY UPDATE client_address='%s', contract_address='%s', status=%d;`,
		ClientAddress, ContractAddress, regStatus, ClientAddress, ContractAddress, regStatus);

    pool.getConnection((err, connection) => {
            if(err) {
            console.log("Error in Client - " + ClientAddress);
            console.log(err);
            }
            connection.query(command, (err, result) => {
                    console.log("Watcher connected to DB.");
                    if(!err) {
                    console.log("Record inserted - " + ClientAddress);
                    }
                    });
            connection.release();
            });
}

// get wallet Nonce
web3.eth.getTransactionCount(walletAddress).then((nonce) => {
    walletNonce = nonce;
    console.log("Nonce = ", walletNonce);
});

// Start watching desired directory
dir = '/home/darshi/registrations';
chokidar.watch(dir, {persistent: true}).on('all', registerFile);

function addFileToQueue(event, filePath) {
    console.log(event, filePath);
    // when new file detected, store it in a queue.
    queue.push(filePath);
}

async function registerFile(event, filePath) {
    if(event == 'add' && (path.basename(filePath) == 'info.json')) {
        try {
            let info = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            let ContractABI = JSON.parse(info.ContractABI);
            let ClientAddress = info.ClientAddress;
            let ContractAddress = info.ContractAddress;

            let hash = '';
            let sha = crypto.createHash('sha256');
            let file = fs.readFileSync(path.dirname(filePath) + '/' + 'ChallengeVideo.mp4');
            sha.update(file);
            hash = sha.digest('hex');
            let duplicate = findDuplicate(dict, hash);
            console.log('Duplicate File? :', duplicate);
            if(!duplicate) {
                dict[filePath] = hash;
                await loadWallet(walletPath, walletAddress, walletPassword);
                console.log("Wallet loaded.");
                let smartContract = await loadContract(ContractABI, ContractAddress, walletAddress, "50000000000", "60000");
                console.log("Smart Contract generated.");
                let challengePhrase = await getChallengePhrase(smartContract);
                console.log("challengePhrase = ", challengePhrase);
                let receipt = await validateKuwaID(walletAddress, ContractAddress, smartContract, "60000", "50000000000");
                console.log(receipt);
                let regStatus = await getStatus(smartContract, ContractAddress);
                console.log("Registration Status of " + ClientAddress + "= " + regStatus);
                insertRow(ClientAddress, ContractAddress, regStatus);
            }
            else {
                await loadWallet(walletPath, walletAddress, walletPassword);
                console.log("Wallet loaded.");
                let smartContract = await loadContract(ContractABI, ContractAddress, walletAddress, "50000000000", "60000");
                console.log("Smart Contract generated.");
                let challengePhrase = await getChallengePhrase(smartContract);
                console.log("challengePhrase = ", challengePhrase);
                let receipt = await inValidateKuwaID(walletAddress, ContractAddress, smartContract, "60000", "50000000000");
                console.log(receipt);
                let regStatus = await getStatus(smartContract, ContractAddress);
                console.log("Registration Status of " + ClientAddress + "= " + regStatus);
                insertRow(ClientAddress, ContractAddress, regStatus);
            }
            queue.shift();
        }
        catch(err) {
            console.log("ERROR: " + err.message);
        }
    }
}
