var axios= require('axios');
var Web3 = require('web3');
var solc = require('solc');
var keythereum = require('keythereum');
var util = require('util');
const express = require("express");
const router = express.Router();
const fs = require("fs");
var properties = fs.readFileSync(".config.json"); 
var db = require("../../mysql_query");
const qs = require('qs');
var walletNonce = 0;
properties = JSON.parse(properties);
// Web3 initialisations
var web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider(properties['provider']));

web3.eth.getTransactionCount("0x"+properties['accountAddress']).then((nonce) => {
      walletNonce = nonce;
      //console.log("Nonce = ", walletNonce);
    });

/**
 * This function compiles the solidity file. 
 * @return {object} this function returns an object called compilation which contains the bytecode and abi for two different smart contracts.
 */
var compileSolFile = async function() {
    var output;
    try {
        let kuwaRegistrationInput = {
            'ERC20Interface.sol': fs.readFileSync(properties['ERC20Interface'], 'utf8'),
            'SafeMath.sol': fs.readFileSync(properties['SafeMath'], 'utf8'),
            'Owned.sol': fs.readFileSync(properties['Owned'], 'utf8'),
            'KuwaToken.sol': fs.readFileSync(properties['KuwaToken'], 'utf8'),
            'KuwaRegistration.sol': fs.readFileSync(properties['KuwaRegistration'], 'utf8')
        };
        output = solc.compile({sources: kuwaRegistrationInput}, 1);
    }
    catch (err) {
        console.log(err);
    }
    // console.log(output);
    let compilation = {
        kuwaRegistration: {},
        kuwaToken: {}
    }
    if (output) {
        compilation.kuwaRegistration.bc = output.contracts['KuwaRegistration.sol:KuwaRegistration'].bytecode;
        compilation.kuwaRegistration.abi = JSON.parse(output.contracts['KuwaRegistration.sol:KuwaRegistration'].interface);
        compilation.kuwaToken.bc = output.contracts['KuwaToken.sol:KuwaToken'].bytecode;
        compilation.kuwaToken.abi = JSON.parse(output.contracts['KuwaToken.sol:KuwaToken'].interface);
    }
    return compilation;
}

/**
 * Loads a smart contract
 * @param  {JSON} abi 
 * @param  {string} contractAddress 
 * @param  {number} gas 
 * @param  {string} gasPrice 
 * @param  {string} from 
 * @return 
 */
var loadContract = async function(abi, contractAddress, gas, gasPrice, from) {
    let contract = new web3.eth.Contract(abi);
    contract.options.address = contractAddress;
    contract.options.from = from;
    contract.options.gasPrice = gasPrice;
    contract.options.gas = gas;
    return contract;
}

/**
 * Deploys a smart contract
 * @param {JSON} abi
 * @param {bytecode} bc
 * @param {number} gas
 * @param {string} gasPrice
 * @param {string} WalletAddress
 * @param {args} constructorArgs default args for Smart Contract Deployment. 
 */
var deployContract = async function(abi, bc, gas, gasPrice, walletAddress, constructorArgs) {
    let contract = new web3.eth.Contract(abi);
    
    try{

      let contractInstance = await contract.deploy({
        data: '0x' + bc,
        arguments: constructorArgs
        }).send({
          from: walletAddress,
          gas: gas,
          gasPrice: gasPrice,
          nonce: walletNonce++
        })

        //walletNonce = walletNonce + 1;
        contractInstance.options.from = walletAddress;
        contractInstance.options.gasPrice = gasPrice;
        contractInstance.options.gas = gas;
        console.log("Contract Address: " + contractInstance.options.address);
        

        return contractInstance;

    }
    catch(err){
      console.log("and the error is: " + err);
    }
    
}

/**
 * Loads the wallet
 * @param  {string} walletPath     
 * @param  {string} accountAddress 
 * @param  {string} password       
 */
var loadWallet = async function(walletPath, accountAddress, password) {
    web3.eth.accounts.wallet.clear();
    let keyObject = keythereum.importFromFile(accountAddress, walletPath);
    let privateKey = keythereum.recover(password, keyObject);
    privateKey = "0x" + privateKey.toString("hex");
    web3.eth.accounts.wallet.add(privateKey);
    //return privateKey;
}

/**
 * The main run function which inserts data into the database after deploying the contract
 * @param {object} req express middleware request object
 * @param {object} res express middleware response object
 * @param {string} ip ip address of the client user
 */
var run = async function(req, res, ip) {
    
    //loadWallet
    await loadWallet(properties['walletPath'], properties['accountAddress'], properties['password']);

    //compile solidity file
    let compilation = await compileSolFile(properties['solFilePath'], 'KuwaRegistration');
    
    //deploy the smart contract
    let contractInstance =  await deployContract(compilation.kuwaRegistration.abi, compilation.kuwaRegistration.bc, 4300000, '22000000000', "0x"+properties['accountAddress'], [req.fields.address, properties['dummyAddress']]);

    //open a connection to mysql database
    db.getConnection(function(err, connection) {
      // Use the connection
      var sql_query = "INSERT INTO sponsorship_request (sponsorship_request_id, ip, contract_address, client_address) VALUES ("+ null+ ", '"+ ip + "', '"+ contractInstance.options.address+"','" + req.fields.address + "')";
         
      connection.query( sql_query, function (error, row, fields) {
      
      res.status(200).json({
         message: 'Valid Passcode',
         contractAddress: contractInstance.options.address,
         abi: compilation.kuwaRegistration.abi
      });


      // And done with the connection.
      connection.release();

      // Handle error after the release.
      if (error) console.log(error);

    // Don't use the connection here, it has been returned to the pool.
      });
    });

}

/**
 * This function changes the registration status on the smartContract for each user's status.
 * @param {json} abi 
 * @param {string} contractAddress
 * @param {number} gas
 * @param {string} gasPrice
 * @param {string} address
 * @param {object} req
 */
var setRegistrationStatusTo = async function(abi, contractAddress, gas, gasPrice, address, req){
  
  
  let contract = await loadContract(abi, contractAddress, gas, gasPrice, address);
  try{
    await contract.methods.setRegistrationStatusTo(web3.utils.utf8ToHex(req.fields.registrationStatus)).send({
          from: "0x"+properties['accountAddress'],
          gas: gas,
          gasPrice: gasPrice,
          nonce: walletNonce
        });
    walletNonce = walletNonce + 1;
  }
  catch(err){
    console.log(err);
  }

}

/**
 * This function adds the scanned kuwa id to the smart contract.
 * @param {object} abi
 * @param {string} contractAddress
 * @param {number} gas
 * @param {string} gasPrice
 * @param {string} address
 * @param {object} req
 */
var addScannedKuwaId = async function(abi, contractAddress, gas, gasPrice, address, req){
  console.log(req.fields.scannedKuwaId);
  let contract = await loadContract(abi, contractAddress, gas, gasPrice, address);

  try{

    await contract.methods.addScannedKuwaId(req.fields.scannedKuwaId).send({
          from: "0x"+properties['accountAddress'],
          gas: gas,
          gasPrice: gasPrice,
          nonce: walletNonce
        });
  }

  catch(err){
    console.log(err);
  }

}


/**
 * Start of all the routes to the sponsor service API.
 */


/**
 * GET Requests
 */
router.get('/', (req, res, next) => {
  res.status('200').json({
    message: 'Handling GET requests to /sponsorship_requests'
  });
});


router.get('/:SS', (req , res) => {

  var sponsorship_requests = [];

  if(properties['SS'] === req.params.SS){

    db.getConnection(function(err, connection) {
      // Use the connection
      connection.query('SELECT * FROM sponsorship_request', function (error, rows, fields) {
     
      rows = JSON.stringify(rows);
      
      rows = JSON.parse(rows);
      
      sponsorship_requests = rows; 

      res.status(200).json({
               message: 'valid Shared Secret ',
               sponsorship_requests: sponsorship_requests        
      });


      // And done with the connection.
      connection.release();

      // Handle error after the release.
      if (error) console.log(error);

      // Don't use the connection here, it has been returned to the pool.
      });
    });
  //res.end();
  }
  else{
    res.status('200').json({
    message: 'invalid Shared Secret'
    }); 
  }
});

/**
 * POST Requests 
 */

router.post('/verifyHuman', (req, res, next) => {
  //console.log(req);
  axios.post('https://www.google.com/recaptcha/api/siteverify', qs.stringify({
    secret : properties['secret'],
    response : req.fields.response,
    remoteip: req.connection.remoteAddress
  })).then((result) => {
    console.log(result);
    res.status('200').json({
        message: result.data.success
    }); 
  })
});

router.post('/deployContract/', (req, res, next) => {
  
  db.getConnection(function(err, connection) {
    // Use the connection
    var sql_query = "SELECT a.cntr, re.status from passcode_request re,(SELECT COUNT(*) cntr from passcode_request re2 WHERE re2.passcode = "+ "'"+req.fields.SS+"') a WHERE re.passcode = "+ "'"+req.fields.SS+"'";
    connection.query(sql_query, function (error, rows, fields) {
    
    rows = JSON.stringify(rows);
    rows = JSON.parse(rows);

    if(rows.length != 0 || req.fields.SS == "Test"){
      if(req.fields.SS == "Test" || (rows[0]['cntr'] == 1 && rows[0]['status'] == 1)){
      
      //Get clients ip Address
      var ip = req.headers['x-forwarded-for'] || 
       req.connection.remoteAddress || 
       req.socket.remoteAddress ||
       (req.connection.socket ? req.connection.socket.remoteAddress : null);
    
      //deploy the Contract
      run(req, res, ip).then(() => {
        var sql_query_2 = "UPDATE passcode_request SET status = 0 WHERE passcode = "+"'"+req.fields.SS+"'"; 

        connection.query(sql_query_2, function (err, row, field) {
      
        row = JSON.stringify(row);
        row = JSON.parse(row);

        // Handle error after the release.
        if (err) console.log(err);

        });  
      });
      }
    }
    else{
      res.status('200').json({
        message: 'Your passcode is either invalid or has been used already.'
      }); 
    }
      
    // And done with the connection.
    connection.release();

    // Handle error after the release.
    if (error) console.log(error);

    // Don't use the connection here, it has been returned to the pool.
    });
  });
});

router.post('/setRegistrationStatusTo', (req, res, next) => {

  setRegistrationStatusTo(JSON.parse(req.fields.contractABI), req.fields.contractAddress, 4300000, '22000000000', "0x"+properties['accountAddress'], req).then(() => {

    res.status('200').json({
      message: 'Registration Status Updated'
      });
  });
});

router.post('/addScannedKuwaId', (req, res, next) => {
  //console.log(req);
  addScannedKuwaId(JSON.parse(req.fields.contractABI), req.fields.contractAddress, 4300000, '22000000000', "0x"+properties['accountAddress'], req).then((receipt) => {
    console.log(receipt);
    res.status('200').json({
      message: 'Kuwa Id Added'
      });
  });
});

module.exports = router;
