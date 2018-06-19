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

//console.log(properties['SS']);



// This function compiles the solidity file. Similar to truffle compile, but it is done here.
var compileSolFile = async function(solFilePath, contractName) {
    let readFile = util.promisify(fs.readFile);
    let solidityCode = await readFile(solFilePath, "utf8");
    let input = solidityCode.toString();
    let output = solc.compile(input, 1);
    let compilation = {}
    compilation.bc = output.contracts[':' + contractName].bytecode;
    compilation.abi = JSON.parse(output.contracts[':' + contractName].interface);
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
    let contractInstance =  await deployContract(compilation.abi, compilation.bc, 4300000, '22000000000', "0x"+properties['accountAddress'], [1000000, req.body.address]);

    // let contractInstance = await loadContract(compilation.abi, "0x30768510F1A57B12817CDC2a723C8AE21de071b5", 4300000, "22000000000", "0xF9F83AaA322aB613Db21229BE6ca9E2dF8a1A149");

    //await contractInstance.methods.generateChallenge().send();
    //let challenge = await contractInstance.methods.getChallenge().call();
    //console.log(challenge);

    db.connection.query("INSERT INTO sponsorship_request (sponsorship_request_id, ip, registration_request_address) VALUES ("+ null+ ", '"+ ip + "', '"+ contractInstance.options.address+ "')")
          .on('result', function (row) { 

          	console.log(row['insertId']);         	
          	db.connection.query("SELECT * FROM sponsorship_request WHERE sponsorship_request_id =" + row['insertId'])
          		.on('result', function(row, conn){
          			res.status('201').json({
			message: 'valid Shared Secret ' + row['ip']        	
		 	});	
          		}) 
            
          })
          .on('error', function (err) {
            console.log({error: true, err: err});
          });

}


router.get('/', (req, res, next) => {
	res.status('200').json({
		message: 'Handling GET requests to /sponsorship_requests'
	});
});



router.get('/:SS/:address', (req , res, next) => {

	if(properties['SS'] === req.params.SS){

		res.status('200').json({
		message: 'invalid Shared Secret'
		});
	
	}
	else{


		res.status('200').json({
		message: 'invalid Shared Secret'
		});	
	}
	

});



router.post('/', (req, res, next) => {
	console.log(req.body.SS);
	if(properties['SS'] === req.body.SS){
		
		//Get clients ip Address
		var ip = req.headers['x-forwarded-for'] || 
	     req.connection.remoteAddress || 
    	 req.socket.remoteAddress ||
     	 (req.connection.socket ? req.connection.socket.remoteAddress : null);
		
     	//deploy the Contract

		web3.setProvider(new web3.providers.HttpProvider("https://rinkeby.infura.io/8Dx9RdhjqIl1y3EQzQpl"));


		run(req, res, ip);


     	 //console.log(typeof ip);
  	// 	db.connection.query("INSERT INTO sponsorship_request (sponsorship_request_id, ip, registration_request_address) VALUES ("+ null+ ", '"+ ip + "', '"+ req.body.address+ "')")
   //        .on('result', function (row) { 

   //        	console.log(row['insertId']);         	
   //        	db.connection.query("SELECT * FROM sponsorship_request WHERE sponsorship_request_id =" + row['insertId'])
   //        		.on('result', function(row, conn){
   //        			res.status('201').json({
			// message: 'valid Shared Secret ' + row['ip']        	
		 // 	});	
   //        		}) 
            
   //        })
   //        .on('error', function (err) {
   //          console.log({error: true, err: err});
   //        });


	}
	else{

		
		res.status('200').json({
		message: 'invalid Shared Secret'
		});	
	}
	
});

module.exports = router;