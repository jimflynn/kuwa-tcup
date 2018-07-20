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
		        `INSERT INTO registration (client_address, contract_address, status) VALUES ('%s', '%s', %d) ON DUPLICATE KEY UPDATE client_address='%s', contract_address='%s';`,
			ClientAddress, ContractAddress, status, ClientAddress, ContractAddress);
pool.getConnection((err, connection) => {
		if(err) {
		console.log("Error connecting to DB.");
		}
		connection.query(command, (err, result) => {
				console.log("Watcher connected to DB.");
				if(!err) {
				connection.release();
				console.log("Record inserted successfully.");
				}
				});
		});
}

// Start watching desired directory
dir = '/registrations';
chokidar.watch(dir, {persistent: true}).on('all', registerFile);

function registerFile(event, filePath) {
	console.log(event, filePath);

	// when new file detected, hash it and store in a Map.
	if(event == 'add' && (path.basename(filePath) == 'info.json')) {
		try {
			let info = JSON.parse(fs.readFileSync(filePath, 'utf8'));
			// console.log(info);
			let ContractABI = JSON.parse(info.ContractABI);
			// console.log(ContractABI);
			let ClientAddress = info.ClientAddress;
			let ContractAddress = info.ContractAddress;

			let hash = '';
			let sha = crypto.createHash('sha256');
			let file = fs.ReadStream(path.dirname(filePath) + '/' + 'ChallengeVideo.mp4');
			file.on('data', function(data) {
					sha.update(data);
					})

			file.on('end', function() {
					hash = sha.digest('hex');

					let duplicate = findDuplicate(dict, hash);
					console.log('Duplicate File? :', duplicate);

					if(!duplicate) {

					dict[filePath] = hash;

					try {
					    loadContract(ContractABI, ContractAddress)
					    .then(smartContract => {
							console.log('smartContract generated!');
							smartContract.methods.getChallenge().call()
							.then(challengePhrase => {
									console.log('challengePhrase =', challengePhrase);
									})
							.catch(function(err) {
                                                                   console.log("Get Challenge failed.");
                                                                   insertRow(ClientAddress, ContractAddress, '0');
                                                             })
							})
                                            .catch(function(err) {
						console.log("Loading Contract failed.");
                                                insertRow(ClientAddress, ContractAddress, '0');
                                            });
					}
                                        catch(err) {
                                            console.log(err);
                                            insertRow(ClientAddress, ContractAddress, '0');
                                        }
					// add entry to DB
					insertRow(ClientAddress, ContractAddress, '1');
					}
					else {
						// add entry to DB
						insertRow(ClientAddress, ContractAddress, '0');
					}
			})
		}
                catch(err) {
                    console.log(err);
		}
	}
	else if(event == 'unlinkDir') {
		delete dict[filePath];
	}
}
