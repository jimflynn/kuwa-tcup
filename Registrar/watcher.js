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

var dict = {};

var loadContract = async function(ContractABI, ContractAddress) {
	let contract = new web3.eth.Contract(ContractABI);
	contract.options.address = ContractAddress;
	// contract.options.from = from;
	// contract.options.gasPrice = gasPrice;
	// contract.options.gas = gas;
	return contract;
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
	password: String.raw`(-h(3~8u"_ZE{lV%m(2SWze$F-7K<$,ej:2+@=-O\43**|>j6!2~uPmeJko[ASo=`,
	database: "alpha_kuwa_registrar_moe",
	timezone : 'local',
	dateStrings : true
});

var insertRow = function(ClientAddress, ContractAddress, status) {
	let command = sprintf(
		`INSERT INTO registration (client_address, contract_address, status) VALUES ('%s', '%s', %d) ON DUPLICATE KEY UPDATE client_address='%s', contract_address='%s', status=%d;`,
		ClientAddress, ContractAddress, status, ClientAddress, ContractAddress, status);

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

// Start watching desired directory
dir = '/registrations';
chokidar.watch(dir, {persistent: true}).on('all', registerFile);

// Load wallet credentials
web3.eth.accounts.wallet.clear();
var keyObject = keythereum.importFromFile(properties.accountAddress, properties.walletPath);
var privateKey = keythereum.recover(properties.password, keyObject);
privateKey = "0x" + privateKey.toString("hex");
web3.eth.accounts.wallet.add(privateKey);
console.log(web3.eth.accounts.wallet["0"]);

function registerFile(event, filePath) {
	console.log(event, filePath);

	// when new file detected, hash it and store in a Map.
	if(event == 'add' && (path.basename(filePath) == 'info.json')) {
		try {
			let info = JSON.parse(fs.readFileSync(filePath, 'utf8'));
			let ContractABI = JSON.parse(info.ContractABI);
			let ClientAddress = info.ClientAddress;
			let ContractAddress = info.ContractAddress;

			let hash = '';
			let sha = crypto.createHash('sha256');
			let file = fs.ReadStream(path.dirname(filePath) + '/' + 'ChallengeVideo.mp4');
			file.on('data', function(data) {
				sha.update(data);
			});

			file.on('end', function() {
				hash = sha.digest('hex');
				let duplicate = findDuplicate(dict, hash);
				console.log('Duplicate File? :', duplicate);
				if(!duplicate) {
					dict[filePath] = hash;
					loadContract(ContractABI, ContractAddress).then(smartContract => {
						console.log('smartContract generated!');
						smartContract.methods.getChallenge().call().then(challengePhrase => {
							console.log('challengePhrase =', challengePhrase);
							// add Voice toolkit stuff here
							smartContract.methods.markAsValid().call()
							.then((result) => {
								if(result == true) {
									console.log("Result = " + result);
									insertRow(ClientAddress, ContractAddress, "1");
								}
							})
							// smartContract.methods.markAsValid().send({from: "0x"+properties.accountAddress.toString("hex")})
							// .on('confirmation', (confNumber, receipt) => {
							// 	console.log("Transaction number for " + ClientAddress + " = " + confNumber);
							// })
							// .on('receipt', (receipt) => {
							// 	insertRow(ClientAddress, ContractAddress, "1");
							// })
							// .on('error', console.error);
						})
						.catch(function(err) {
							console.log("Loading Challenge Phrase failed for " + ClientAddress + ".");
							throw err;
						});
					})
					.catch(function(err) {
						console.log("Loading Contract failed for " + ClientAddress + ".");
					});
				}
				else {
					loadContract(ContractABI, ContractAddress).then(smartContract => {
						console.log("smartContract generated.");
						smartContract.methods.markAsInvalid().call()
						.then((result) => {
							if(result == true) {
								console.log("Result = " + result);
								insertRow(ClientAddress, ContractAddress, "0");
							}
						});
						// smartContract.methods.markAsValid().send({from: "0x"+properties.accountAddress.toString("hex")})
						// .on('confirmation', (confNumber, receipt) => {
						// 	console.log("Transaction number for " + ClientAddress + " = " + confNumber);
						// })
						// .on('receipt', (receipt) => {
						// 	insertRow(ClientAddress, ContractAddress, "0");
						// })
						// .on('error', console.error);
					})
					.catch(function(error) {
						console.log("Loading Contract failed for " + ClientAddress + ".");
					});
				}
			});
		}
		catch(err) {
			console.log(err);
		}
	}
	else if(event == 'unlinkDir') {
		delete dict[filePath];
	}
}
