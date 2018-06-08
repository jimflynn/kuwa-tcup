/*
Registrar implementation in Node JS.
*/

var Web3 = require('web3');
var web3 = new Web3('https://rinkeby.infura.io/8Dx9RdhjqIl1y3EQzQpl');

// wrapper over 'fs' module in NodeJS, provides some improvement in watching files
var chokidar = require('chokidar');

// module to read file data
var fs = require('fs');

// module for hashing files
var crypto = require('crypto');

// mysql
var mysql = require('mysql');

// Dictionary for storing mappings from files to their hash values
var dict = {};

var abi = JSON.parse('[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"markAsInvalid","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"killContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"standard","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getChallenge","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"withdrawals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"markAsValid","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"generateChallenge","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getRegistrationStatus","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_initialSupply","type":"uint256"},{"name":"_clientPubKey","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_challenge","type":"uint256"},{"indexed":false,"name":"_registrationStatus","type":"uint8"}],"name":"ChallengeValue","type":"event"}]');

// // TODO: when abi can be stored in text
// var abi = '';
// var stream = fs.ReadStream('abi.txt', 'utf8');
// readStream.on('data', function(chunk) {
// 	abi += chunk;
// }).on('end', function() {
// 	abi = JSON.parse(abi);
//     console.log(abi);
// });

var contractAddress = '0x74A7647557A38328D58E1cE70D51b5566CAC3668';

var loadContract = async function(abi, contractAddress) { //, gas, gasPrice, from) {
    let contract = new web3.eth.Contract(abi);
    contract.options.address = contractAddress;
    // contract.options.from = from;
    // contract.options.gasPrice = gasPrice;
    // contract.options.gas = gas;
    return contract;
}

// Start watching desired directory
dir = './storage/';
chokidar.watch(dir, {persistent: true}).on('all', registerFile);

// main function of the registrar
function registerFile(event, path) {
	console.log(event, path);

	// when new file detected, hash it and store in a Map. Note that this function checks
	// for the 'add' event, not the 'addDir' event.
	if(event == 'add') {
		let sha = crypto.createHash('sha256');
		let file = fs.ReadStream(path);
		let hash = '';

		file.on('data', function(data) {
			sha.update(data);
		})

		file.on('end', function() {
			hash = sha.digest('hex');

			if(!(hash in dict)) {
				dict[hash] = path;
				console.log(path + ' => ' + hash + ': Valid');
				console.log('Current Hash Table: \n', dict);

				let smartContract = loadContract(abi, contractAddress);
				console.log(smartContract.toString());
			}
			else {
				console.log(path + ' => ' + hash + ': Invalid; Hash already exists');
				console.log('Current Hash Table: \n', dict);
			}
		})
	}
}
