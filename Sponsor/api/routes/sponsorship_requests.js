var Web3 = require('web3');
var solc = require('solc');
//var fs = require("fs");
var keythereum = require('keythereum');
var util = require('util');


const express = require("express");

const router = express.Router();

const fs = require("fs");

var properties = fs.readFileSync("properties.txt", 'utf8'); 

var db = require("../../mysql_query");


var web3 = new Web3();

properties = JSON.parse(properties);

//console.log('hello');
//console.log(properties['SS']);



// This function compiles the solidity file. Similar to truffle compile, but it is done here.
var compileSolFile = async function() {
    var output;
    try {
        let kuwaRegistrationInput = {
            'ERC20Interface.sol': fs.readFileSync('/tcup/SmartContracts/contracts/ERC20Interface.sol', 'utf8'),
            'SafeMath.sol': fs.readFileSync('/tcup/SmartContracts/contracts/SafeMath.sol', 'utf8'),
            'Owned.sol': fs.readFileSync('/tcup/SmartContracts/contracts/Owned.sol', 'utf8'),
            'KuwaToken.sol': fs.readFileSync('/tcup/SmartContracts/contracts/KuwaToken.sol', 'utf8'),
            'KuwaRegistration.sol': fs.readFileSync('/tcup/SmartContracts/contracts/KuwaRegistration.sol', 'utf8')
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

var loadContract = async function(abi, contractAddress, gas, gasPrice, from) {
    let contract = new web3.eth.Contract(abi);
    contract.options.address = contractAddress;
    contract.options.from = from;
    contract.options.gasPrice = gasPrice;
    contract.options.gas = gas;
    return contract;
}


var deployContract = async function(abi, bc, gas, gasPrice, from, constructorArgs) {
    let contract = new web3.eth.Contract(abi);
    let contractInstance = await contract.deploy({
        data: '0x' + bc,
        arguments: constructorArgs
    }).send({
        from: from,
        gas: gas,
        gasPrice: gasPrice
    });
    contractInstance.options.from = from;
    contractInstance.options.gasPrice = gasPrice;
    contractInstance.options.gas = gas;
    console.log("Contract Address: " + contractInstance.options.address);
    return contractInstance;
}

var loadWallet = async function(walletPath, accountAddress, password) {
    web3.eth.accounts.wallet.clear();
    let keyObject = keythereum.importFromFile(accountAddress, walletPath);
    let privateKey = keythereum.recover(password, keyObject);
    privateKey = "0x" + privateKey.toString("hex");
    web3.eth.accounts.wallet.add(privateKey);
    //return privateKey;
}


var run = async function(req, res, ip) {
    await loadWallet(properties['walletPath'], properties['accountAddress'], properties['password']);

    let compilation = await compileSolFile(properties['solFilePath'], 'KuwaRegistration');
    let contractInstance =  await deployContract(compilation.kuwaRegistration.abi, compilation.kuwaRegistration.bc, 4300000, '22000000000', "0x"+properties['accountAddress'], [req.fields.address, "0x20e357D506c344EAF82d4C1773De8d75B5f008d8"]);

    // let contractInstance = await loadContract(compilation.abi, "0x30768510F1A57B12817CDC2a723C8AE21de071b5", 4300000, "22000000000", "0xF9F83AaA322aB613Db21229BE6ca9E2dF8a1A149");

    //await contractInstance.methods.generateChallenge().send();
    //let challenge = await contractInstance.methods.getChallenge().call();
    //console.log(challenge);
    db.getConnection(function(err, connection) {
      // Use the connection
      var sql_query = "INSERT INTO sponsorship_request (sponsorship_request_id, ip, contract_address, client_address) VALUES ("+ null+ ", '"+ ip + "', '"+ contractInstance.options.address+"','" + req.fields.address + "')";
         
      connection.query( sql_query, function (error, row, fields) {
      console.log(row);
      //console.log(fields);

      res.status(200).json({
               message: 'valid Shared Secret',
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


router.get('/', (req, res, next) => {
  res.status('200').json({
    message: 'Handling GET requests to /sponsorship_requests'
  });
});

router.get('/:SS', (req , res) => {

  var sponsorship_requests = [];

  if(properties['SS'] === req.params.SS){

    // db.connection.query("SELECT * FROM sponsorship_request")
    //       .on('result', function (row) { 

    //         console.log(res.headersSent);           
    //         return res.status(200).json({
    //           message: 'valid Shared Secret'         
    //         });

    //         //res.write(row['ip']);
    //         res.end();    
            
    //       })
    //       .on('error', function (err) {
    //         console.log({error: true, err: err});
    //       });


    db.getConnection(function(err, connection) {
      // Use the connection
      connection.query('SELECT * FROM sponsorship_request', function (error, rows, fields) {
      //rows = JSON.parse(rows);
      rows = JSON.stringify(rows);
      rows = JSON.parse(rows);
      //console.log(rows);
      
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


router.post('/deployContract/', (req, res, next) => {
  //console.log(req);
  
  

  db.getConnection(function(err, connection) {
      // Use the connection
      var sql_query = "SELECT count(1) from passcode_request re WHERE re.passcode = "+ "'"+req.fields.SS+"'";
      connection.query(sql_query, function (error, rows, fields) {
      
      rows = JSON.stringify(rows);
      rows = JSON.parse(rows);

      console.log(rows);

      if(rows[0]['count(1)'] == 1 || req.fields.SS == "Test"){
      


      console.log("yes");
    //Get clients ip Address
      var ip = req.headers['x-forwarded-for'] || 
       req.connection.remoteAddress || 
       req.socket.remoteAddress ||
       (req.connection.socket ? req.connection.socket.remoteAddress : null);
    
      //deploy the Contract

    


    web3.setProvider(new web3.providers.HttpProvider("https://rinkeby.infura.io/8Dx9RdhjqIl1y3EQzQpl"));

    run(req, res, ip);

    var sql_query_2 = "UPDATE passcode_request SET status = 0 WHERE passcode = "+"'"+req.fields.SS+"'"; 

    // connection.query(sql_query_2, function (err, row, field) {
      
    //   row = JSON.stringify(row);
    //   row = JSON.parse(row);
    //   console.log(row);
    //   // And done with the connection.
    //   connection.release();

    //   // Handle error after the release.
    //   if (err) console.log(err);

    // // Don't use the connection here, it has been returned to the pool.
    //   });


       //console.log(typeof ip);
    //  db.connection.query("INSERT INTO sponsorship_request (sponsorship_request_id, ip, registration_request_address) VALUES ("+ null+ ", '"+ ip + "', '"+ req.body.address+ "')")
   //        .on('result', function (row) { 

   //         console.log(row['insertId']);           
   //         db.connection.query("SELECT * FROM sponsorship_request WHERE sponsorship_request_id =" + row['insertId'])
   //           .on('result', function(row, conn){
   //             res.status('201').json({
      // message: 'valid Shared Secret ' + row['ip']          
     //   }); 
   //           }) 
            
   //        })
   //        .on('error', function (err) {
   //          console.log({error: true, errx: err});
   //        });


  }

  else{

    
    res.status('200').json({
    message: 'invalid Shared Secret'
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


var setRegistrationStatusTo = async function(abi, contractAddress, gas, gasPrice, address, req){
  let contract = await loadContract(abi, contractAddress, gas, gasPrice, address);
  await contract.methods.setRegistrationStatusTo(web3.utils.utf8ToHex(req.fields.registrationStatus)).send();

}

var addScannedKuwaId = async function(abi, contractAddress, gas, gasPrice, address, req){
  console.log(req.fields.scannedKuwaId);
  let contract = await loadContract(abi, contractAddress, gas, gasPrice, address);
  await contract.methods.addScannedKuwaId(req.fields.scannedKuwaId).send();
}

router.post('/setRegistrationStatusTo', (req, res, next) => {
  //console.log(req);
  setRegistrationStatusTo(JSON.parse(req.fields.contractABI), req.fields.contractAddress, 4300000, '22000000000', "0x"+properties['accountAddress'], req).then(() => {

    res.status('200').json({
      message: 'Registration status updated'
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
