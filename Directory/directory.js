var fs = require('fs');
var mysql = require('mysql');
var path = require('path');
var sprintf = require('sprintf-js').sprintf;

var Web3 = require('web3');
var solc = require('solc');
var keythereum = require('keythereum');
var util = require('util');


var web3 = new Web3();
//var conn;

/* @author Carlos Mondragon */
var loadWallet = async function(walletPath, accountAddress, password) {
    web3.eth.accounts.wallet.clear();
    let keyObject = keythereum.importFromFile(accountAddress.substring(2), walletPath);
    let privateKey = keythereum.recover(password, keyObject);
    privateKey = "0x" + privateKey.toString("hex");
    web3.eth.accounts.wallet.add(privateKey);
}

/* @author Carlos Mondragon */
var loadContract = async function(abi, contractAddress, gas, gasPrice, from) {
    let contract = new web3.eth.Contract(abi);
    contract.options.address = contractAddress;
    contract.options.from = from;
    contract.options.gasPrice = gasPrice;
    contract.options.gas = gas;
    return contract;
}

var getCurrentDateTime = function() {
    var date;
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' +
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);
    return date
}

var getClientInfo = async function(clientDir, files) {
    var data, videoFilePath;

    files.forEach(function(file) {
        try {
            if (file == 'info.json') {
                data = JSON.parse(fs.readFileSync(clientDir + "/" + file, 'utf-8'));
            }

            if (path.parse(file).ext == '.mp4') {
                videoFilePath = clientDir + "/" + file;
            }
        } catch (err) {
            console.log(err);
        }
    });

    if (data)
        data.videoFilePath = videoFilePath;

    return data;
}

var getDirListing = async function(rootDir) {
    let readDir = util.promisify(fs.readdir);
    var dirs;
    try {
        dirs = await readDir(rootDir);
    } catch (err) {
        console.log("Error reading directory");
        console.log(err);
    }

    return dirs;
}

var processClientDir = async function(rootDir, clientDir, myAddress) {
    var clientAddr = '0x' + clientDir;
    clientDir = rootDir + "/" + clientDir;

    var stats = fs.statSync(clientDir);
    if (stats.isFile())
        return undefined;

    let files = await getDirListing(clientDir);
    let data;
    if (files)
        data = await getClientInfo(clientDir, files);

    if (data == undefined)
        return undefined;

    try {
        let contract = await loadContract(JSON.parse(data.contractABI), data.contractAddress, 4300000, '22000000000', myAddress);
        data.status = await contract.methods.getRegistrationStatus().call();
    }
    catch (err) {
        console.log(err);
        return undefined;
    }

    return data;
}

var insertIntoDBSingle = async function(conn, tableName, data) {
    var date = getCurrentDateTime();
    var command = sprintf("INSERT INTO %s (registration_id, kuwa_address, contract_address, \
                                                     application_binary_interface_id, status, created, \
                                                     updated, last_checked) \
                           VALUES (%d, '%s', '%s', %d, %d, '%s', '%s', '%s');",
                           tableName, 0, data.clientAddress, data.contractAddress, 1, data.status, date, date, date);

    conn.query(command, function(err, results, fields) {
        if (err) {
            console.log(err);
        }
    });
}

/*var insertIntoDBBatch = async function() {
    https://stackoverflow.com/questions/8899802/how-do-i-do-a-bulk-insert-in-mysql-using-node-js
}*/

var run = async function() {
    var rootDir = process.env.PWD + "/" + "test";
    var myAddress = "0xde89471e94ffaaf346090abe1ccd4b448818dcbf";
    var keyStoreDir = "/home/jun/.ethereum";
    var password = "tcup";
    web3.setProvider(new web3.providers.HttpProvider("https://rinkeby.infura.io/8Dx9RdhjqIl1y3EQzQpl"));

    await loadWallet(keyStoreDir, myAddress, password).catch(
        function(error) {
            console.log(error);
            throw new Error("failed to load wallet");
        }
    );

    var conn = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'root',
      database : 'test'
    });
    conn.connect();

    var clientDirs = await getDirListing(rootDir);

    for (var i = 0; i < clientDirs.length; i++) {
        let data = await processClientDir(rootDir, clientDirs[i], myAddress);
        if (data)
            await insertIntoDBSingle(conn, 'registration', data);
    }

    conn.end();
}

run().catch(err => console.log(err));
