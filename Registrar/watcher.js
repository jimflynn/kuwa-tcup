/*
 * @file Implementation of watcher service in Node JS.
 * @author The Kuwa Foundation / Priyadarshi Rath
 */

const fs         = require('fs');
const path       = require('path');
const chokidar   = require('chokidar');
const pool       = require("./mysql_pool.js");
const sprintf    = require("sprintf-js").sprintf;

const crypto     = require('crypto');
const Web3       = require('web3');
const keythereum = require('keythereum');
const web3       = new Web3('https://rinkeby.infura.io/8Dx9RdhjqIl1y3EQzQpl');

const properties     = JSON.parse(fs.readFileSync("./properties.json", "utf-8"));
const walletPath     = properties.walletPath;
const walletAddress  = "0x" + properties.accountAddress.toString("hex");
const walletPassword = properties.password;
var walletNonce      = 0;

var dict = {};

/**
 * @async
 * @function loadWallet 
 * @description Loads an Ethereum wallet file using a specified path, address and password.
 * @param  {String} walletPath
 * @param  {String} accountAddress
 * @param  {String} password
 * @returns {void}
 */
var loadWallet = async function (walletPath, accountAddress, password) {
	web3.eth.accounts.wallet.clear();
	var keyObject = keythereum.importFromFile(accountAddress, walletPath);
	var privateKey = keythereum.recover(properties.password, keyObject);
	privateKey = "0x" + privateKey.toString("hex");
	web3.eth.accounts.wallet.add(privateKey);
}

/**
 * @async
 * @function loadContract 
 * @description Loads a Kuwa Registration Smart Contract.
 * @param  {Object} ContractABI
 * @param  {String} ContractAddress
 * @param  {String} from
 * @param  {String} gasPrice
 * @param  {String} gas
 * @returns {Promise} contract - Promise object representing the smart contract.
 */
var loadContract = async function(ContractABI, ContractAddress, from, gasPrice, gas) {
	let contract = new web3.eth.Contract(ContractABI);
	contract.options.address = ContractAddress;
	contract.options.from = from;
	contract.options.gasPrice = gasPrice;
	contract.options.gas = gas;
	return contract;
}

/**
 * @async
 * @function getChallengePhrase
 * @description Gets the challenge phrase for a Kuwa Registration Smart Contract.
 * @param  {Object} smartContract
 * @returns {Promise} phrase - Promise object representing the challenge phrase.
 */
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

/**
 * @async
 * @function validateKuwaID 
 * @description Marks a Kuwa ID as Valid.
 * @param  {String} senderAddress
 * @param  {String} ContractAddress
 * @param  {Object} smartContract
 * @param  {String} gasLimit
 * @param  {String} gasPrice
 * @returns {Promise} receipt - Promise object representing the transaction receipt.
 */
var validateKuwaID = async function(senderAddress, ContractAddress, smartContract, gasLimit, gasPrice) {
	console.log('Sending Transaction...');
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

/**
 * @async
 * @function inValidateKuwaID 
 * @description Marks a Kuwa ID as Invalid.
 * @param  {String} senderAddress
 * @param  {String} ContractAddress
 * @param  {Object} smartContract
 * @param  {String} gasLimit
 * @param  {String} gasPrice
 * @returns {Promise} receipt - Promise object representing the transaction receipt.
 */
var inValidateKuwaID = async function(senderAddress, ContractAddress, smartContract, gasLimit, gasPrice) {
	console.log('Sending Transaction...');
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

/**
 * @async
 * @function getStatus 
 * @description Gets the registration status for a Kuwa Registration Smart Contract.
 * @param  {Object} smartContract
 * @returns {Promise} registrationStatus - Promise object representing the registration status of the smart contract.
 */
var getStatus = async function(smartContract) {
	console.log('Getting Status...');
	try {
		let registrationStatus = smartContract.methods.getRegistrationStatus().call();
		return registrationStatus;
	}
	catch(error) {
		console.log("ERROR in getStatus: ", error.message);
	}

}

/**
 * @function findDuplicate
 * @description Finds if a new candidate for registration is a valid person.
 * @param  {Object} mapping
 * @param  {String} hashval
 * @returns {Boolean} isDuplicate - Value indicating whether the new person is valid (new).
 */
var findDuplicate = function(mapping, hashval) {
	let isDuplicate = false;
	for (var key in mapping) {
		if (mapping[key] === hashval)
			isDuplicate = true;
	}
	return isDuplicate;
}

/**
 * @function insertRow
 * @description Inserts a row into the registrar database.
 * @param  {String} ClientAddress
 * @param  {String} ContractAddress
 * @param  {String} regStatus
 * @returns {void}
 */
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

/////////////////////////////////////////////////////
//           MAIN EXECUTION BEGINS HERE            //
/////////////////////////////////////////////////////

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

/**
 * @async
 * @function registerFile 
 * @description The main execution function of the watcher.
 * @param  {Event}  event
 * @param  {String} filePath
 * @returns {void}
 */
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
