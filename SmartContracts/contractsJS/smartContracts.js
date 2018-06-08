var Web3 = require('web3');
var solc = require('solc');
var fs = require("fs");
var keythereum = require('keythereum');
var util = require('util');

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://rinkeby.infura.io/8Dx9RdhjqIl1y3EQzQpl"));

// This function compiles the solidity file. Similar to truffle compile, but it is done here.
var compileSolFile = async function(solFilePath, contractName) {
    var output;
    try {
        let readFile = util.promisify(fs.readFile);
        let solidityCode = await readFile(solFilePath, "utf8");
        let input = solidityCode.toString();
        output = solc.compile(input, 1);
    }
    catch (err) {
        console.log(err);
    }

    let compilation = {}
    if (output) {
        compilation.bc = output.contracts[':' + contractName].bytecode;
        compilation.abi = JSON.parse(output.contracts[':' + contractName].interface);
    }

    return compilation;
}

var loadWallet = async function(walletPath, accountAddress, password) {
    web3.eth.accounts.wallet.clear();
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
    let wallet = await loadWallet('/home/jun/.ethereum', '0xde89471e94ffaaf346090abe1ccd4b448818dcbf', 'tcup').catch(
        function(error) {
            console.log(error);
            throw new Error("failed to load wallet");
        }
    );

    let compilation = await compileSolFile("KuwaRegistration.sol", "KuwaRegistration");
    if (Object.keys(compilation).length === 0) {
        throw new Error("failed to compile solidity contract");
    }

    let contractInstance =  await deployContract(compilation.abi, compilation.bc, 4300000, '22000000000', "0xde89471e94ffaaf346090abe1ccd4b448818dcbf", [1000, "clientPubKey"]);
    if (contractInstance == null) {
        throw new Error("failed to deploy contract");
    }

    // let contractInstance = await loadContract(compilation.abi, "0x30768510F1A57B12817CDC2a723C8AE21de071b5", 4300000, "22000000000", "0xF9F83AaA322aB613Db21229BE6ca9E2dF8a1A149");

    await contractInstance.methods.generateChallenge().send();
    let challenge = await contractInstance.methods.getChallenge().call();
    console.log(challenge);
}

run().catch(err => console.log(err));
