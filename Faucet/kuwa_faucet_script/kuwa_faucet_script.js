/**
 * @module Faucet payment script
 * @description Implementation of the faucet script which can be run to trigger payments to all valid Kuwa IDs
 * @author The Kuwa Foundation / Hrishikesh Kashyap
 */
// Get private stuff from my kuwa_faucet_script_config_private.json file
var CONFIG = require('./kuwa_faucet_script_config_private.json');


process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Need access to my path and file system
var fs = require('fs');
var axios = require('axios');

// Ethereum javascript libraries needed
const Web3 = require('web3')
var Tx = require('ethereumjs-tx');
var fetch = require("node-fetch");
// Rather than using a local copy of geth, interact with the ethereum blockchain via infura.io
const web3 = new Web3(Web3.givenProvider || CONFIG.web3Connection)

/**
 * @async
 * @function transferKuwaCoin 
 * @description Transfers 1 KuwaCoin to the specified destination wallet address
 * @param  {String} destAddress
 * @returns {Promise}
 */
async function transferKuwaCoin(destAddress){

    // This code was written and tested using web3 version 1.0.0-beta.26

    var myAddress = CONFIG.KuwaCoinWalletAddr;    

    var transferAmount = 1;
    var value = transferAmount*(Math.pow(10,18)); //kuwacoin is divisble to the standard 18 decimal places

    // Determine the nonce
    var count = await web3.eth.getTransactionCount(myAddress);
    console.log(`Number of transactions so far: ${count}`);

    // This file is just JSON taken from the contract page on etherscan.io under "Contract ABI"
    var abiArray = JSON.parse(fs.readFileSync('./KuwaCoinABI.json', 'utf-8'));

    // This is the address of the contract which created the ERC20 KuwaCoin token
    var contractAddress = CONFIG.KuwaCoinContractAddr;
    var contract = new web3.eth.Contract(abiArray, contractAddress, { from: myAddress });

    // How many kuwa coins do I have before sending?
    var balance = await contract.methods.balanceOf(myAddress).call();
    console.log(`Balance before send: ${balance}`);

    // I chose gas price and gas limit based on what ethereum wallet was recommending for a similar transaction. You may need to change the gas price!
    var rawTransaction = {
        "from": myAddress,
        "nonce": "0x" + count.toString(16),
        "gasPrice": "0x003B9ACA00",
        "gasLimit": "0x250CA",
        "to": contractAddress,
        "value": "0x0",
        "data": contract.methods.transfer(destAddress, value).encodeABI(),
        "chainId": 0x04
    };

    // The private key must be for myAddress
    var privKey = new Buffer(CONFIG.KuwaCoinWalletPrivKey, 'hex');
    var tx = new Tx(rawTransaction);
    tx.sign(privKey);
    var serializedTx = tx.serialize();

    console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}`);
    var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));

    balance = await contract.methods.balanceOf(myAddress).call();
    balance_dest = await contract.methods.balanceOf(destAddress).call();
    console.log(`Sender Balance after send: ${balance/18}`);
    console.log(`Dest Balance after send: ${balance_dest/18}`);


  return new Promise(function(resolve,reject){

    resolve()
    })
  
}
const main = async () => {
    /**
     * @async
     * @function getValidRegistrations 
     * @description Fetches all the valid Kuwa IDs and starts the payment process for each of them
     * @returns {void}
     */
    const getValidRegistrations = async url => {
      try {
        const response = await fetch('https://alpha.kuwa.org:3006/get_valid_ids');
        const json = await response.json();

        console.log('Total number of valid IDs: ', json.length);
        for(var i=0;i<json.length;i++){
            console.log('\nTransferring KuwaCoins to ', json[i].client_address);
            await transferKuwaCoin(json[i].client_address);

        }
        
      } catch (error) {
        console.log(error);
      }
};

    getValidRegistrations('https://alpha.kuwa.org:3006/get_valid_ids');

  
}

main();
