/*
Watcher implementation in Node JS.

TODO: 
1. Obtain ``abi``, ``ClientAddress``, and ``contractAddress`` from storage manager
2. Test for Sybil accounts using Video recognition toolkits.
*/

var fs = require('fs');
var mysql = require('mysql');
var crypto = require('crypto');
var chokidar = require('chokidar');
var spawn = require('child_process').spawn;
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

    // call python sub-process
    var py = spawn('python', ['./Sybil_detection/test.py']);
    py.stdout.on('data', function(data) {
        console.log(data.toString());
    })
    py.stdout.on('end', function(){
        console.log("Python process terminated successfully!!");
    });

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
        let sql = "INSERT INTO registration (client_address, contract_address, status)"
                    + " VALUES (" 
                    + "'" + ClientAddress + "'," 
                    + "'" + ContractAddress + "'," 
                    + status + ")";
	pool.getConnection((err, connection) => {
		if(err) {
			console.log("Error connecting to DB.");
		}
		connection.query(sql, (err, result) => {
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
                //console.log(filePath + ' => ' + hash + ': Valid');
                // console.log("Current Hash Table:");
                // console.log(dict);

                // TODO: for now, only display the smart contract challenge phrase
                // later while setting up the complete system, get `ContractAddress` from storage manager
                loadContract(ContractABI, ContractAddress)
                    .then(smartContract => {
                        console.log('smartContract generated!');
                        smartContract.methods.getChallenge().call()
                        .then(challengePhrase => {
                            // challengePhrase will show up as 0, because contract has (probably) expired
                            console.log('challengePhrase =', challengePhrase);
                        });
                    });

                // add entry to DB
                insertRow(ClientAddress, ContractAddress, '1');
            }
            else {
                //console.log(filePath + ' => ' + hash + ': Invalid; Hash already exists');
                // console.log("Current Hash Table:");
                // console.log(dict);

                // add entry to DB
                insertRow(ClientAddress, ContractAddress, '0');
            }
        })
    }
    else if(event == 'unlinkDir') {
        //console.log('Deleting ', filePath, '...');
        delete dict[filePath];
        //console.log('dict = ', dict);
    }
}
