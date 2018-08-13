const fs = require('fs');
const mysql = require('mysql');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const Web3 = require('web3');
const solc = require('solc');
const keythereum = require('keythereum');
const util = require('util');
const SqlString = require('sqlstring');


class DirScanner {
    constructor(dirToScanPath, ethClient) {
        this.dirToScanPath = dirToScanPath;
        this.ethClient = ethClient;
    }

    async getClientInfo(clientDir, files) {
        let data, videoFilePath;

        files.forEach(function(file) {
            try {
                if (file == 'info.json') {
                    data = JSON.parse(fs.readFileSync(clientDir + "/" + file, 'utf-8'));
                }
                else if (path.parse(file).ext == '.mp4') {
                    videoFilePath = clientDir + "/" + file;
                }
            } catch (err) {
                console.error(err);
                /* TODO */
                throw err;
            }
        });

        if (data) {
            data.videoFilePath = videoFilePath;
            try {
                let contract = await this.ethClient.loadContract(
                                    JSON.parse(data.ContractABI), data.ContractAddress,
                                    4300000, '22000000000', this.ethClient.myAddress
                                );
                data.status = await contract.methods.getRegistrationStatus().call();
            }
            catch (err) {
                console.error(err);
                /*TODO*/
                throw err;
            }
        }

        return data;
    }

    getDirListing(rootDir) {
        let dirs;
        try {
            dirs = fs.readdirSync(rootDir);
        } catch (err) {
            console.error(err);
            /*TODO*/
            throw err;
        }

        return dirs;
    }

    async processClientDir(clientDir) {
        let clientAddr = '0x' + clientDir;
        clientDir = this.dirToScanPath + "/" + clientDir;
        let clientInfo;

        try {
            let stats = fs.statSync(clientDir);
            if (stats.isFile())
                return undefined;

            let files = this.getDirListing(clientDir);
            if (files)
                clientInfo = await this.getClientInfo(clientDir, files);

            if (clientInfo == undefined)
                return undefined;
        }
        catch (err) {
            /* TODO */
            console.log(undefined);
            return undefined;
        }

        return clientInfo;
    }
}

class DBClient {
    constructor(host, user, password, database) {
        this.conn = this.createConnection(host, user, password, database);
    }

    createConnection(host, user, password, database) {
        let conn = mysql.createConnection({
          host     : host,
          user     : user,
          password : password,
          database : database
        });

        return conn;
    }

    insertOrUpdateSingle(tableName, data) {
        let date = getCurrentDateTime();

        let command = sprintf(
                        `INSERT INTO %s \
                         (registration_id, kuwa_address, contract_address, \
                         application_binary_interface_id, status, created, \
                         updated, last_checked) \
                         VALUES (%d, '%s', '%s', %d, %s, '%s', '%s', '%s') \
                         ON DUPLICATE KEY UPDATE
                         application_binary_interface_id = %d, status = %s, updated = '%s';
                         `,
                         tableName,
                         0, data.ClientAddress, data.ContractAddress, 1, data.status, date, date, date,
                         1, data.status, date
                     );
        this.conn.query(command, function(err, results, fields) {
            if (err) {
             console.error(err);
            }
            console.log('Rows affected:', results.affectedRows);
        });

        // Prepared/parameterized statement not working...
        /*let insertVals = [0, data.clientAddress, data.contractAddress, 1, data.status,
                          date, date, date];
        let updateVals = [1, data.status, date];
        let vals = [tableName, insertVals, ...updateVals];
        console.log(vals);
        let command = 'INSERT INTO ?\
                      (registration_id, kuwa_address, contract_address,\
                      application_binary_interface_id, status, created,\
                      updated, last_checked)\
                      VALUES ?\
                      ON DUPLICATE KEY UPDATE\
                      application_binary_interface_id = ?, status = ?, updated = ?\
                      ';
        this.conn.query(command, vals, function(err, results, fields) {
            if (err) {
                console.error(err);
            }
            console.log('Rows affected:', results.affectedRows);
        });*/
    }

    insertBatch() {
        /* TODO */
    }

    updateBatch() {
        /* TODO */
    }

    static createFromConfig({host, user, password, database}) {
        return new DBClient(host, user, password, database);
    }
}

class EthClient {
    constructor(myAddress, keyStoreDir, password, ethNetworkUrl) {
        this.myAddress = myAddress;
        this.keyStoreDir = keyStoreDir;
        this.password = password;
        this.web3 = new Web3();
        this.web3.setProvider(new this.web3.providers.HttpProvider(ethNetworkUrl));
    }

    loadWallet(/*walletPath, password*/) {
        //if (arguments.length == 2)
        this.web3.eth.accounts.wallet.clear();
        let keyObject = keythereum.importFromFile(this.myAddress.substring(2), this.keyStoreDir);
        let privateKey = keythereum.recover(this.password, keyObject);
        privateKey = "0x" + privateKey.toString("hex");
        this.web3.eth.accounts.wallet.add(privateKey);
    }

    async loadContract(abi, contractAddress, gas, gasPrice) {
        let contract = new this.web3.eth.Contract(abi);
        contract.options.address = contractAddress;
        contract.options.from = this.myAddress;
        contract.options.gasPrice = gasPrice;
        contract.options.gas = gas;
        return contract;
    }

    static createFromConfig({my_address, key_store_dir, password, eth_network_url}) {
        return new EthClient(my_address, key_store_dir, password, eth_network_url);
    }
}

function getCurrentDateTime() {
    let date;
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' +
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);
    return date;
}


/**
 * Driver function to run the scan process.
 */
let run = async function() {
    let configFilePath = "config.json";
    let config = JSON.parse(fs.readFileSync(configFilePath));
    let ethClient = EthClient.createFromConfig(config["eth_client"]);
    ethClient.loadWallet();
    let dirScanner = new DirScanner(config["dir_to_scan"], ethClient);
    let dbClient = DBClient.createFromConfig(config["db_client"]);

    dbClient.conn.connect();
    let clientDirs = dirScanner.getDirListing(dirScanner.dirToScanPath);
    for (let i = 0; i < clientDirs.length; i++) {
        let data = await dirScanner.processClientDir(clientDirs[i]);
        if (typeof(data) !== "undefined")
            await dbClient.insertOrUpdateSingle('registration', data);
    }
    dbClient.conn.end();
}

run().catch(err => console.log(err));
