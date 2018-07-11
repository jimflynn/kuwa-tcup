// server.js

const express = require('express');
let app = express();
const PORT = 3000;

const Web3 = require('web3');
let web3 = new Web3();

//setting the provider to the local testrpc network
web3.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'));
web3.eth.defaultAccount = web3.eth.accounts[0];


app.get('/', function(req, res){
   res.sendFile(__dirname + '/public/index.html');
});

app.get('/blockchain', function(req,res){
   // web3.eth.getAccounts(function(err, accounts){
   //    if(err == null) res.send(JSON.stringify(accounts));
   // });

   var contractABI = [
	{
		"constant": true,
		"inputs": [],
		"name": "key3",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "key2",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "key1",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getValidKuwaID",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]
	
	//using the contract ABI to create the contract object and initialising an instnce of it
	var KuwaFaucet = web3.eth.contract(contractABI);

	//calling the getValidKuwaID method to retrieve the list of public keys
   message = KuwaFaucet.at('0xeb3ec6eee46acecfeee10fa097049c88826e71c3').getValidKuwaID.call();

   res.send((message));


});

app.listen(PORT, function(){
   console.log('Server is started on port:',PORT);
});
