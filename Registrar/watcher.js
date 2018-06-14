/*
Watcher implementation in Node JS.
*/

var Web3 = require('web3');
var web3 = new Web3('https://rinkeby.infura.io/8Dx9RdhjqIl1y3EQzQpl');
var fs = require('fs');
var chokidar = require('chokidar');
var crypto = require('crypto');
var mysql = require('mysql');
var dict = {};

// TODO: obtain this from storage manager
var abi = JSON.parse('[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"markAsInvalid","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"killContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"standard","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getChallenge","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"withdrawals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"markAsValid","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"generateChallenge","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getRegistrationStatus","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_initialSupply","type":"uint256"},{"name":"_clientPubKey","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_challenge","type":"uint256"},{"indexed":false,"name":"_registrationStatus","type":"uint8"}],"name":"ChallengeValue","type":"event"}]');

// TODO: obtain this from storage manager
var client_address = "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

// TODO: obtain this from storage manager
var contractAddress = '0x74A7647557A38328D58E1cE70D51b5566CAC3668';

var loadContract = async function(abi, contractAddress) {
    let contract = new web3.eth.Contract(abi);
    contract.options.address = contractAddress;
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

var createSQLConnection = function() {
    let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "sqlpassword",
        database: "alpha_kuwa_registrar_moe",
        timezone : 'local',
        dateStrings : true
    });

    return con;
} 

var insertRow = function(connection, client_address, contractAddress, status) {
    connection.connect(function(err) {
        if (err) {
            throw err;
        }
        console.log("Watcher has connected to Kuwa Database!");
        let sql = "INSERT INTO registration (client_address, contract_address, status)"
                    + " VALUES (" 
                    + "'" + client_address + "'," 
                    + "'" + contractAddress + "'," 
                    + status + ")";
        connection.query(sql, function (err, result) {
            if (err) {
                throw err;
            }
            console.log("1 record inserted");
        });
    });
}

// Start watching desired directory
dir = './storage/';
chokidar.watch(dir, {persistent: true}).on('all', registerFile);

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

            let duplicate = findDuplicate(dict, hash);
            console.log('Duplicate File:', duplicate);

            if(!duplicate) {

                dict[path] = hash;
                console.log(path + ' => ' + hash + ': Valid');
                console.log("Current Hash Table:");
                console.log(dict);

                // TODO: for now, only display the smart contract challenge phrase
                // later while setting up the complete system, get `contractAddress` from storage manager
                loadContract(abi, contractAddress)
                    .then(smartContract => {
                        smartContract.methods.getChallenge().call()
                        .then(challengePhrase => {
                            // challengePhrase will show up as 0, because contract has (probably) expired
                            console.log('challengePhrase =', challengePhrase);
                        });
                    });

                // add entry to DB
                let con = createSQLConnection();
                insertRow(con, client_address, contractAddress, '1');
            }
            else {
                console.log(path + ' => ' + hash + ': Invalid; Hash already exists');
                console.log("Current Hash Table:");
                console.log(dict);

                // add entry to DB
                let con = createSQLConnection();
                insertRow(con, client_address, contractAddress, '0');
            }
        })
    }
    else if(event == 'unlink') {
        console.log('path = ', path, '  dict[path] = ', dict[path]);
        console.log('Deleting....');
        delete dict[path];
        console.log('dict = ', dict);
    }
}
