/**
 * @module Watcher
 * @description Implementation of watcher service in Node JS.
 * @author The Kuwa Foundation / Priyadarshi Rath
 */

const fs         = require('fs');
const path       = require('path');
const chokidar   = require('chokidar');
const sprintf    = require("sprintf-js").sprintf;

const crypto     = require('crypto');
const Web3       = require('web3');
const keythereum = require('keythereum');
const web3       = new Web3('https://rinkeby.infura.io/8Dx9RdhjqIl1y3EQzQpl');

const pool           = require("../mysql_pool.js");
const properties     = JSON.parse(fs.readFileSync("../properties.json", "utf-8"));
const walletPath     = properties.walletPath;
const walletAddress  = "0x" + properties.accountAddress.toString("hex");
const walletPassword = properties.password;
var   walletNonce    = 0;

var dictionary = {};

/**
 * @async
 * @function loadWallet 
 * @description Loads an Ethereum wallet file using a specified path, address and password.
 * @param   {String} walletPath     - The path to the registrar's wallet JSON file.
 * @param   {String} accountAddress - Ethereum address of the registrar's wallet.
 * @param   {String} password       - Password to the registrar's wallet.
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
 * @param   {Object}  ContractABI     - Application Binary Interface obtained after deploying the Kuwa Registration Smart Contract.
 * @param   {String}  ContractAddress - Address of the Kuwa Registration Smart Contract.
 * @param   {String}  from            - Ethereum address of the registrar's wallet.
 * @param   {String}  gasPrice        - The amount of ether the registrar is willing to spend per unit of gas.
 * @param   {String}  gas             - The maximum amount of gas the registrar wants to spend on this transaction.
 * @returns {Promise} contract        - Promise object representing the smart contract.
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
 * @param   {Object}  smartContract - Object representing Kuwa Registration Smart Contract.
 * @returns {Promise} phrase        - Promise object representing the challenge phrase.
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
 * @param   {String}   senderAddress    - Ethereum address of the registrar's wallet.
 * @param   {String}   ContractAddress  - Address of the Kuwa Registration Smart Contract.
 * @param   {Object}   smartContract    - Object representing Kuwa Registration Smart Contract.
 * @param   {String}   gasLimit         - The maximum amount of gas the registrar wants to spend on this transaction.
 * @param   {String}   gasPrice         - The amount of ether the registrar is willing to spend per unit of gas.
 * @returns {Promise}  receipt          - Promise object representing the transaction receipt.
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
 * @param   {String}  senderAddress   - Ethereum address of the registrar's wallet.
 * @param   {String}  ContractAddress - Address of the Kuwa Registration Smart Contract.
 * @param   {Object}  smartContract   - Object representing Kuwa Registration Smart Contract.
 * @param   {String}  gasLimit        - The maximum amount of gas the registrar wants to spend on this transaction.
 * @param   {String}  gasPrice        - The amount of ether the registrar is willing to spend per unit of gas.
 * @returns {Promise} receipt         - Promise object representing the transaction receipt.
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
 * @param   {Object}  smartContract      - Object representing Kuwa Registration Smart Contract.
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
 * @param   {Object}  dictionary  - A dictionary containing all valid registrations.
 * @param   {String}  hashval     - The hash value obtained by hashing the new video file.
 * @returns {Boolean} isDuplicate - Value indicating whether the new person is valid (new).
 */
var findDuplicate = function(hashval) {
	let isDuplicate = false;
	
	for (var key in dictionary) {
		if (dictionary[key] === hashval) {
			isDuplicate = true;
			break;
		}
	}

	return isDuplicate;
}

/**
 * @function insertRow
 * @description Inserts a row into the registrar database.
 * @param   {String} ClientAddress   - Ethereum address of the Client.
 * @param   {String} ContractAddress - Ethereum address of the Kuwa Registration Smart Contract.
 * @param   {String} regStatus       - The status of the Kuwa Registration Smart Contract corresponding to the Client.
 * @returns {void}
 */
var insertRow = function(ClientAddress, ContractAddress, regStatus) {
	let command = sprintf(
			`INSERT INTO registration (client_address, contract_address, status) 
			VALUES ('%s', '%s', '%s') 
			ON DUPLICATE KEY UPDATE client_address='%s', contract_address='%s', status='%s';`,
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

///////////////////////////////////////////////////
//          MAIN EXECUTION BEGINS HERE           //
///////////////////////////////////////////////////

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
dir = '/home/darshi/Kuwa/videos';
chokidar.watch(dir, {persistent: true}).on('all', registerFile);

/**
 * @async
 * @function registerFile 
 * @description The main execution function of the watcher.
 * @param   {Event}  event    - Any change/update to the directory being watched.
 * @param   {String} filePath - Absolute path to the new file added.
 * @returns {void}
 */
async function registerFile(event, filePath) {
	if(event == 'add' && (path.basename(filePath) == 'info.json')) {
		try {
			let info = JSON.parse(fs.readFileSync(filePath, 'utf8'));
			let ContractABI = JSON.parse(info.ContractABI);
			let ClientAddress = info.ClientAddress;
			let ContractAddress = info.ContractAddress;

			let smartContract = await loadContract(ContractABI, ContractAddress, walletAddress, "22000000000", "4300000");
			console.log("Smart Contract generated.");

			let hash = '';
			let sha = crypto.createHash('sha256');
			let file = fs.readFileSync(path.dirname(filePath) + '/' + 'ChallengeVideo.mp4');
			sha.update(file);
			hash = sha.digest('hex');
			let duplicate = findDuplicate(hash);

			if(!duplicate) {
				dictionary[filePath] = hash;
				let challengePhrase = await getChallengePhrase(smartContract);
				console.log("challengePhrase = ", challengePhrase);
				let receipt = await validateKuwaID(walletAddress, ContractAddress, smartContract, "4300000", "22000000000");
				console.log("Receipt = ", receipt);
				let regStatus = await getStatus(smartContract, ContractAddress);
				regStatus = web3.utils.hexToUtf8(regStatus);
				console.log("Registration Status of " + ClientAddress + " = " + regStatus);
				// insertRow(ClientAddress, ContractAddress, regStatus);
			}
			else {
				let challengePhrase = await getChallengePhrase(smartContract);
				console.log("challengePhrase = ", challengePhrase);
				let receipt = await inValidateKuwaID(walletAddress, ContractAddress, smartContract, "4300000", "22000000000");
				console.log(receipt);
				let regStatus = await getStatus(smartContract, ContractAddress);
				regStatus = web3.utils.hexToUtf8(regStatus);
				console.log("Registration Status of " + ClientAddress + " = " + regStatus);
				// insertRow(ClientAddress, ContractAddress, regStatus);
				
			}

			// console.log(dictionary);
		}
		catch(error) {
			console.log(error);
		}
	}
}
