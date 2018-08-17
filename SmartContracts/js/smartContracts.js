var Web3 = require('web3');
var solc = require('solc');
var fs = require("fs");
var keythereum = require('keythereum');
var util = require('util');

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://rinkeby.infura.io/8Dx9RdhjqIl1y3EQzQpl"));

// This function compiles the solidity file. Similar to truffle compile, but it is done here.
var compileSolFile = async function() {
    var output;
    try {
        let kuwaRegistrationInput = {
            'ERC20Interface.sol': fs.readFileSync('../contracts/ERC20Interface.sol', 'utf8'),
            'SafeMath.sol': fs.readFileSync('../contracts/SafeMath.sol', 'utf8'),
            'Owned.sol': fs.readFileSync('../contracts/Owned.sol', 'utf8'),
            'KuwaToken.sol': fs.readFileSync('../contracts/KuwaToken.sol', 'utf8'),
            'KuwaRegistration.sol': fs.readFileSync('../contracts/KuwaRegistration.sol', 'utf8')
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

var loadWallet = async function(walletPath, accountAddress, password) {
    // web3.eth.accounts.wallet.clear();
    let keyObject = keythereum.importFromFile(accountAddress.substring(2), walletPath);
    let privateKey = keythereum.recover(password, keyObject);
    privateKey = "0x" + privateKey.toString("hex");
    web3.eth.accounts.wallet.add(privateKey);
}

var deployContract = async function(abi, bc, gas, gasPrice, from, constructorArgs) {
    if (gas <= 0) {
        console.log("deployContract(): must provide a gas value greater than 0");
        return undefined;
    }

    var contractInstance;
    try {
        let contract = new web3.eth.Contract(abi);
        contractInstance = await contract.deploy({
            data: '0x' + bc,
            arguments: constructorArgs
        }).send({
            from: from,
            gas: gas,
            gasPrice: gasPrice
        });
    } catch (err) {
        console.log(err);
    }

    if (contractInstance) {
        contractInstance.options.from = from;
        contractInstance.options.gasPrice = gasPrice;
        contractInstance.options.gas = gas;
        console.log("Contract Address: " + contractInstance.options.address);
    }

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
    let compilation
    let contractInstA
    let contractInstB
    loadWallet('/home/clankster99/.ethereum/rinkeby', '0xf9f83aaa322ab613db21229be6ca9e2df8a1a149', 'tcupManush')
        .then(() => loadWallet('/home/clankster99/.ethereum/rinkeby', '0xf8ab93792c669f30954c0f0b0e25df46bdb59136', 'wheethereum'))
        .then(() => compileSolFile())
        .then(comp => {
            compilation = comp
            return deployContract(compilation.kuwaRegistration.abi, compilation.kuwaRegistration.bc, 4300000, '22000000000', "0xf9f83aaa322ab613db21229be6ca9e2df8a1a149", ["0xf9f83aaa322ab613db21229be6ca9e2df8a1a149", "0xb324c068Bf7C89E51C8A5E54e7D6b45F380a2Daa"])
        })
        .then(contract => {
            contractInstA = contract
            return loadContract(compilation.kuwaRegistration.abi, contract.options.address, 4300000, "22000000000", "0xf8ab93792c669f30954c0f0b0e25df46bdb59136");
        })
        .then(contract => {
            contractInstB = contract
            return Promise.all([
                contractInstA.methods.setRegistrationStatusTo(web3.utils.utf8ToHex('Valid')).send(),
                contractInstB.methods.setRegistrationStatusTo(web3.utils.utf8ToHex('Video Uploaded')).send()
            ])
        })
        .catch(() => {
            console.log("Catch an Exception")
        })
        .then(() => contractInstB.methods.getRegistrationStatus().call())
        .then(registrationStatus => {
            console.log(web3.utils.hexToUtf8(registrationStatus))
            web3.eth.accounts.wallet.clear();
        })
}

run().catch(err => console.log(err));
