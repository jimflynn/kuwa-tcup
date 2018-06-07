var Web3 = require('web3');
var solc = require('solc');
var fs = require("fs");
var keythereum = require('keythereum');
var util = require('util');

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://rinkeby.infura.io/8Dx9RdhjqIl1y3EQzQpl"));

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

var loadWallet = async function(walletPath, accountAddress, password) {
    web3.eth.accounts.wallet.clear();
    let keyObject = keythereum.importFromFile(accountAddress, walletPath);
    let privateKey = keythereum.recover(password, keyObject);
    privateKey = "0x" + privateKey.toString("hex");
    web3.eth.accounts.wallet.add(privateKey);
    return privateKey;
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

var loadContract = async function(abi, contractAddress, gas, gasPrice, from) {
    let contract = new web3.eth.Contract(abi);
    contract.options.address = contractAddress;
    contract.options.from = from;
    contract.options.gasPrice = gasPrice;
    contract.options.gas = gas;
    return contract;
}

var run = async function() {
    await loadWallet('/home/clankster99/.ethereum/rinkeby/', 'f9f83aaa322ab613db21229be6ca9e2df8a1a149', 'tcupManush');

    let compilation = await compileSolFile("../contracts/KuwaRegistration.sol", "KuwaRegistration");
    let contractInstance =  await deployContract(compilation.abi, compilation.bc, 4300000, '22000000000', "0xF9F83AaA322aB613Db21229BE6ca9E2dF8a1A149", [1000, "clientPubKey"]);

    // let contractInstance = await loadContract(compilation.abi, "0x30768510F1A57B12817CDC2a723C8AE21de071b5", 4300000, "22000000000", "0xF9F83AaA322aB613Db21229BE6ca9E2dF8a1A149");

    await contractInstance.methods.generateChallenge().send();
    let challenge = await contractInstance.methods.getChallenge().call();
    console.log(challenge);
}

run();