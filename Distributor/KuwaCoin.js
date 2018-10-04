const Web3 = require('web3');
var Tx = require('ethereumjs-tx');
var Fetch = require("node-fetch");

class KuwaCoin {

  constructor(ethNetworkUrl, abi, contract_address, callBack) {
    this.debug = true;
    this.web3 = new Web3();
    this.web3.setProvider(new this.web3.providers.HttpProvider(ethNetworkUrl));
    this.abi = abi;
    this.contract_address = contract_address;
    this.lastCount = 0;
    this.loadContract(callBack);
  }

  async loadContract(callBack) {
    this.contract = await new this.web3.eth.Contract(this.abi, this.contract_address);
    callBack(this);
  }

  async getBalance(config) {
    var balance = await this.contract.methods.balanceOf(config.kuwaID).call();
    balance = balance/(Math.pow(10,18));
    config['callBack'](balance, config);
  }

  async transfer(config) {
    //const value = config.amount*(Math.pow(10,18));
    var transferAmount = 1;
    var value = transferAmount*1000000000000000000;
    //var value = transferAmount*(Math.pow(10,18));
    const to = config.to; // aka "destAddress"
    const from = config.from; // aka "myAddress"
    const privateKey = config.privateKey;
    const contract_address = config.contract_address;
    var contract = new this.web3.eth.Contract(this.abi, contract_address, { from: from });
    //var contract = new this.web3.eth.Contract(abi, contractAddress, { from: from });

    // Sender's before balance
    var balance = await contract.methods.balanceOf(from).call();
    balance = balance/(Math.pow(10,18));
    this.dbg(`Balance before send: ${balance}`);
    var count = await this.web3.eth.getTransactionCount(from);
    //count = count + 1;
    this.dbg(`Number of transactions so far: ${count}`);
    if ( this.lastCount == count ) count++;
    this.lastCount = count;

    // I chose gas price and gas limit based on what ethereum wallet was recommending for a similar transaction. You may need to change the gas price!
    var rawTransaction = {
        "from": from,
        "nonce": "0x" + count.toString(16),
        "gasPrice": "0x003B9ACA00",
        "gasLimit": "0x250CA",
        "to": contract_address,
        "value": "0x0",
        "data": contract.methods.transfer(to, "1000000000000000000").encodeABI(),
        "chainId": 0x04
    };
    // The private key must be for myAddress
    var privKey = new Buffer(privateKey, 'hex');
    var tx = new Tx(rawTransaction);
    tx.sign(privKey);
    var serializedTx = tx.serialize();
    this.dbg(`Sending a signed tx:  ${serializedTx.toString('hex')}`);
    var receipt = await this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    balance = await contract.methods.balanceOf(from).call();
    balance = balance/(Math.pow(10,18));
    var balance_dest = await contract.methods.balanceOf(to).call();
    balance_dest = balance_dest/(Math.pow(10,18));
    this.dbg(`Sender Balance after send: ${balance}`);
    this.dbg(`Dest Balance after send: ${balance_dest}`);
    if (config.callBack != null ) {
      config.callBack(balance_dest, config);
    }
  }

  dbg(text) {
    if (this.debug) console.log(text);
  }

}

module.exports = KuwaCoin;
