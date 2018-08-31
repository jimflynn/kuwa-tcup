/**
    This program scans the directory in the Kuwa Storage Manager registrations repository
    containing the Kuwa client directories with the client address as the name of the directory.
    The directory hierarchy is as follows:

    rootDir/
        0x6dc989e6d3582f5c3da1fd510a5b0ad950d67f3a/
            - info.json
                {
                    "ClientAddress": "0x6dc989e6d3582f5c3da1fd510a5b0ad950d67f3a",
                    "ContractAddress": "0x066335f8A852A6A0C2761e82829524eb8C950515",
                    "ContractABI": "[{\"constant\":true,\"inputs\":[],..."
                }
            - video.mp4

    Each Kuwa client directory will contain an 'info.json', which will contain the client address,
    the client's contract address, and the contract JSON ABI. It will also contain the video
    recording of the client speaking the challenge phrase.

    The program will read the information necessary to load the Kuwa client's smart contract in
    order to call the getRegistrationStatus() function to obtain the status of the client.

    It will then store this information into the 'registration' table of the MySQL DB so that
    one can quickly retrieve Kuwa client addresses with a certain status.

    This program should be run as a cron job to get the most recent statuses of the clients.
 */

const fs = require('fs');
const mysql = require('mysql');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const Web3 = require('web3');
const solc = require('solc');
const keythereum = require('keythereum');
const util = require('util');
const SqlString = require('sqlstring');


/**
 * This class contains functions to scan the Kuwa client directories uploaded to
 * the raw registrations repository by the Kuwa Storage Manager whenever a new user registers to
 * become a Kuwa client.
 */
class DirScanner {
    /**
     * Creates a new Directory Scanner object.
     * 
     * @class
     * @param {string} dirToScanPath - The absolute path to the root directory containing all the 
     *                                 Kuwa client directories.
     * @param {EthClient} ethClient - An object containing functions and variables to interact with the 
     *                                Ethereum blockchain.
     */
    constructor(dirToScanPath, ethClient) {
        this.dirToScanPath = dirToScanPath;
        this.ethClient = ethClient;
    }


    /**
     * @typedef {Object} ClientInfo
     * @property {string} status The current status of the Kuwa client
     * @property {string} videoFilePath Absolute path to the video file of the user speaking the challenge phrase
     * @property {string} ContractAddress The Ethereum address of the Kuwa client ("0x123abc...")
     * @property {string} ContractABI The application binary interface (in JSON) of the Kuwa client's deployed contract
     */

    /**
     * Returns information about a Kuwa client based on the files in its directory.
     * 
     * @param {string} clientDir - The absolute path to a Kuwa client directory
     * @param {Array} files - An array of filenames (should be static) inside the client directory
     * @returns {ClientInfo} Information about a Kuwa client
     */
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
                                    4300000, '22000000000');
                data.status = Web3.utils.hexToUtf8(await contract.methods.getRegistrationStatus().call());
            }
            catch (err) {
                console.error(err);
                /*TODO*/
                throw err;
            }
        }

        return data;
    }

    /**
     * Retrieves the contents of a directory.
     * 
     * @param {string} rootDir - The absolute path to the target directory
     * @returns {Array} - An array of filenames inside the target directory
     */
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

    /**
     * Processes a Kuwa client directory by retrieving the necessary information
     * to store into the database.
     * 
     * @param {string} clientDir - The absolute path of a Kuwa client directory
     * @returns {ClientInfo} Information about a Kuwa client
     */
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
    /**
     * Creates a new MySQL database client.
     * 
     * @class
     */
    constructor(host, user, password, database) {
        this.conn = this.createConnection(host, user, password, database);
    }

    /**
     * Creates a new connection to the MySQL database.
     * 
     * @param {string} host - The hostname of the database to connect to
     * @param {string} user - The user to authenticate as
     * @param {string} password - The password of the user
     * @param {string} database - The name of the database for the connection
     * @returns {Object} The connection object
     */
    createConnection(host, user, password, database) {
        let conn = mysql.createConnection({
          host     : host,
          user     : user,
          password : password,
          database : database
        });

        return conn;
    }

    /**
     * Insert or update a single row in the table corresponding to a Kuwa client.
     * 
     * @param {string} tableName - Name of the table
     * @param {ClientInfo} data - Information about a Kuwa client
     */
    insertOrUpdateSingle(tableName, data) {
        let date = getCurrentDateTime();

        let command = sprintf(
                        `INSERT INTO %s \
                         (registrationB_id, kuwa_address, contract_address, \
                         application_binary_interface_id, status, created, \
                         updated, last_checked) \
                         VALUES (%d, '%s', '%s', %d, '%s', '%s', '%s', '%s') \
                         ON DUPLICATE KEY UPDATE
                         application_binary_interface_id = %d, status = '%s', updated = '%s';
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

    /**
     * Create a database client using a configuration object from a configuration file.
     * 
     * @param {Object} The configuration object
     * @returns {DBClient} The DBClient object created from a configuration object
     *                     using destructuring assignment
     */
    static createFromConfig({host, user, password, database}) {
        return new DBClient(host, user, password, database);
    }
}

class EthClient {
    /**
     * Create a new client for interacting with the Ethereum blockchain.
     * 
     * @class
     * @param {string} myAddress - The address transactions should be sent from (the origin EOA or wallet address)
     * @param {string} keyStoreDir - The Ethereum keystore directory containing the JSON file that contains the
     *                               public/private key pair for the wallet
     * @param {string} password - The password for recovering the private key from the JSON file
     * @param {string} ethNetworkUrl - The URL to access the Ethereum network over HTTP
     */
    constructor(myAddress, keyStoreDir, password, ethNetworkUrl) {
        this.myAddress = myAddress;
        this.keyStoreDir = keyStoreDir;
        this.password = password;
        this.web3 = new Web3();
        this.web3.setProvider(new this.web3.providers.HttpProvider(ethNetworkUrl));
    }

    /**
     * Loads an Ethereum wallet.
     */
    loadWallet(/*walletPath, password*/) {
        //if (arguments.length == 2)
        this.web3.eth.accounts.wallet.clear();
        let keyObject = keythereum.importFromFile(this.myAddress.substring(2), this.keyStoreDir);
        let privateKey = keythereum.recover(this.password, keyObject);
        privateKey = "0x" + privateKey.toString("hex");
        this.web3.eth.accounts.wallet.add(privateKey);
    }

    /**
     * Loads an already deployed contract in the Ethereum blockchain.
     * 
     * @param {string} abi - The application binary interface (in JSON) of the Kuwa client's deployed contract
     * @param {string} contractAddress - The address of the contract
     * @param {number} gas - The maximum gas provided for this transaction (gas limit)
     * @param {string} gasPrice - Amount of ether you're willing to pay for every unit of gas
     */
    async loadContract(abi, contractAddress, gas, gasPrice) {
        let contract = new this.web3.eth.Contract(abi);
        contract.options.address = contractAddress;
        contract.options.from = this.myAddress;
        contract.options.gasPrice = gasPrice;
        contract.options.gas = gas;
        return contract;
    }

    /**
     * Create an Ethereum client using a configuration object from a configuration file.
     * 
     * @param {Object} The configuration object
     * @returns {EthClient} An EthClient object created from a configuration object
     *                      using destructuring assignment
     */
    static createFromConfig({my_address, key_store_dir, password, eth_network_url}) {
        return new EthClient(my_address, key_store_dir, password, eth_network_url);
    }
}

/**
 * @returns {string} The current datetime (UTC) in 'yyyy-MM-dd HH:mm:ss' format.
 */
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
    let configFilePath = "config_private.json";
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
