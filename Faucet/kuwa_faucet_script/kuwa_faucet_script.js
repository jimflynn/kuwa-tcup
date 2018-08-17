// Get private stuff from my .env file
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Need access to my path and file system
var fs = require('fs');
var axios = require('axios');

// Ethereum javascript libraries needed
const Web3 = require('web3')
var Tx = require('ethereumjs-tx');
var fetch = require("node-fetch");
// Rather than using a local copy of geth, interact with the ethereum blockchain via infura.io
const web3 = new Web3(Web3.givenProvider || `https://rinkeby.infura.io/8Dx9RdhjqIl1y3EQzQpl`)

async function transferKuwaCoin(destAddress, nonce){

    // This code was written and tested using web3 version 1.0.0-beta.26
    //console.log(`\nweb3 version: ${web3.version}`)

    // Who holds the token now?
    var myAddress = "0x0Ff6144CBc4e71C06C269b49bCB86ECf69c7C8F8";

    // Who are we trying to send this token to?
    

    // If your token is divisible to 8 decimal places, 42 = 0.00000042 of your token
    var transferAmount = 1;
    var value = transferAmount*(Math.pow(10,18));

    // Determine the nonce
    var count = await web3.eth.getTransactionCount(myAddress);
    console.log(`Number of transactions so far: ${count}`);

    // This file is just JSON stolen from the contract page on etherscan.io under "Contract ABI"
    var abiArray = JSON.parse(fs.readFileSync('./mycoin.json', 'utf-8'));

    // This is the address of the contract which created the ERC20 token
    var contractAddress = "0x3b5C339aa3DEBad8A5b7C8e73f1D5E0B8B4Ea30E";
    var contract = new web3.eth.Contract(abiArray, contractAddress, { from: myAddress });

    // How many tokens do I have before sending?
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

    // Example private key (do not use): 'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109'
    // The private key must be for myAddress
    var privKey = new Buffer('3ee85be537f134c218efc95f0a5ccc8645fa6b08375b334cf5c7734bb840f131', 'hex');
    var tx = new Tx(rawTransaction);
    tx.sign(privKey);
    var serializedTx = tx.serialize();

    // Comment out these three lines if you don't really want to send the TX right now
    console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}`);
    var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    //console.log(`Receipt info:  ${JSON.stringify(receipt, null, '\t')}`);

    // The balance may not be updated yet, but let's check
    balance = await contract.methods.balanceOf(myAddress).call();
    balance_dest = await contract.methods.balanceOf(destAddress).call();
    console.log(`Sender Balance after send: ${balance/18}`);
    console.log(`Dest Balance after send: ${balance_dest/18}`);


  return new Promise(function(resolve,reject){

    resolve()
    })
  
}
// Create an async function so I can use the "await" keyword to wait for things to finish
const main = async () => {

    const getValidRegistrations = async url => {
  try {
    const response = await fetch('https://alpha.kuwa.org:3006/get_valid_ids');
    const json = await response.json();
    // console.log(
    //   `City: ${json.result[0]} -`
    // );

    var myAddress = "0x0Ff6144CBc4e71C06C269b49bCB86ECf69c7C8F8";

    var nonce = web3.eth.getTransactionCount(myAddress);
    //console.log('initial nonce value ', nonce);

    console.log('Total number of valid IDs: ', json.length);
    for(var i=0;i<json.length;i++){
        console.log('\nTransferring KuwaCoins to ', json[i].client_address);
        await transferKuwaCoin(json[i].client_address, nonce);

    }
    
  } catch (error) {
    console.log(error);
  }
};

    getValidRegistrations('https://alpha.kuwa.org:3006/get_valid_ids');


  //     var myAddress = "0x0Ff6144CBc4e71C06C269b49bCB86ECf69c7C8F8";

  // var nonce = web3.eth.getTransactionCount(myAddress);
  // console.log('initial nonce value ', nonce);
  // var addresses = ["0x009344C549B93675090dA9A3ae72816bcFC2F046","0x9c92b87f6e30b0a1a418b6067400af91d51e0cb8","0x17355d7ab7d95a46abea618f19cb673e6d642b90"]
  // for(var i=0;i<addresses.length;i++){
  //   console.log(`\n`,addresses[i]);
    
  // }
  
}

main();