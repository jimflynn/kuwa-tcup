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
    let wallet = await loadWallet('/home/clankster99/.ethereum/rinkeby', '0xf9f83aaa322ab613db21229be6ca9e2df8a1a149', 'tcupManush')

    let compilation = await compileSolFile();

    // let contractInstance =  await deployContract(compilation.kuwaRegistration.abi, compilation.kuwaRegistration.bc, 4300000, '22000000000', "0xf9f83aaa322ab613db21229be6ca9e2df8a1a149", ["0xf9f83aaa322ab613db21229be6ca9e2df8a1a149", "0xb324c068Bf7C89E51C8A5E54e7D6b45F380a2Daa"]);

    let kuwaTokenInstance = await deployContract(compilation.kuwaToken.abi, compilation.kuwaToken.bc, 4300000, '22000000000', "0xf9f83aaa322ab613db21229be6ca9e2df8a1a149", []);

    // let contractInstance = await loadContract(compilation.abi, "0x30768510F1A57B12817CDC2a723C8AE21de071b5", 4300000, "22000000000", "0xF9F83AaA322aB613Db21229BE6ca9E2dF8a1A149");

    await kuwaTokenInstance.methods.transfer("0x5a9e7bc667433ef82626de8e0d8576dbccb10683", 9).send({ from:"0xf9f83aaa322ab613db21229be6ca9e2df8a1a149" })

    let balance = await kuwaTokenInstance.methods.balanceOf("0xf9f83aaa322ab613db21229be6ca9e2df8a1a149").call({ from:"0xf9f83aaa322ab613db21229be6ca9e2df8a1a149" })
    console.log(balance);

    // let challenge = await contractInstance.methods.getChallenge().call();
    // console.log(challenge);
    // await contractInstance.methods.addScannedKuwaId("0xF9F83AaA322aB613Db21229BE6ca9E2dF8a1A149").send()
    // let kuwaNetwork = await contractInstance.methods.getKuwaNetwork().call();
    // console.log(kuwaNetwork);
}

run().catch(err => console.log(err));
