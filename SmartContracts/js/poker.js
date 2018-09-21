/**
 * This file simulates the Poker protocol implemented via the KuwaRegistration.sol, QualifiedKuwaRegistrar.sol,
 * and KuwaToken.sol smart contracts by using web3js to interact with the Ethereum blockchain.
 * 
 * This simulation is very simple and only tests the beginning phase of the Poker protocol.
 * Future implementations will give losing Registrars the ability to to challenge a majority vote:
  
    There are three Registrars.
	Each Registrar bets 1 Kuwa Token on a KR.
	The KR’s Sponsor also contributes 1 Kuwa Token (transaction fee or incentive ante).
	Pot = 4 Kuwa Tokens (3 from the Registrars, and 1 from the Sponsor)
	Registrars 	#1 and #2 vote that a KR is invalid.
	Registrar 	#3 votes that a KR is valid.
	Registrars 	#1 and #2 “win” since they are in the majority. Registrar #3 has lost.
	Registrars 	#1 and #2 split the pot They get 2 Kuwa Tokens each (net profit of 1 Kuwa Token each).
	Registrar 	#3 (the loser) gets nothing (net loss of 1 Kuwa Token).
    
 *  In this simulation, Registrars #1 and #2 are Alice and Bob, Registrar #3 is Carlos.
 *  Registrars vote by providing the keccak256 hash of their vote (0 or 1) and a salt (a random bytes32 value).
 *  After the first valid vote is cast, other Registrars have 1 hour to vote.
 *  After the voting process ends, Registrars are required to reveal their votes within 1 hour by providing the original vote and salt.
 *  The hash of these two values must match the committed vote provided during the voting process for the Registrar or voter to be deemed honest.
 *  After the reveal process ends, the Sponsor decides the majority vote which then becomes the final status of the Kuwa client.
 *  The winning Registrars are then responsible for claiming their reward.
 * 
 *  This file requires the 'wallets_private.json' configuration file and the './keystore' directory to run the simulation.
 *  './wallets_private.json' contains the public Ethereum wallet addresses of all the participants in the simulation
 *  './keystore' directory contains information to import the private keys of these participants (using keythereum)
 */
var Web3 = require('web3');
var solc = require('solc');
var fs = require("fs");
var keythereum = require('keythereum');
var util = require('util');
var md5 = require('md5');

var web3 = new Web3();
// Set the web3 HTTP provider to access the Ethereum test network given by the url in 'wallets_private.json'
web3.setProvider(new web3.providers.HttpProvider(JSON.parse(fs.readFileSync('wallets_private.json')).eth_network_url));

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

    console.log(output);
    let compilation = {}
    if (output) {
        compilation.bc = output.contracts[':' + contractName].bytecode;
        compilation.abi = JSON.parse(output.contracts[':' + contractName].interface);
    }

    return compilation;
}

var loadWallet = async function(walletPath, accountAddress, password) {
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
    
    web3.eth.accounts.wallet.clear();

    // // Alice: (1, "0x1")
    // let aliceCommit = "0x633c048f70a5b29b15342939cffc35d88af48ce91d93b340c6bd1dfbae54faa7";
    // // Bob: (1, "0x2")
    // let bobCommit = "0x75aea9dd444ae0a80175efff3f1cffb4c72f7249c7a3e2c295133d41cf2dcdf5";
    // // Carlos: (0, "0x3")
    // let carlosCommit = "0x66607c6af1e9511fb2a66ace9345f9e56fcca50dfaeae155ae2712fb85f2412a";

    // The committed votes of the Registrars
    // Alice: keccak256(1, "0xfff23243") Alice votes "Valid" or 1 (type uint) with a salt of "0xfff23243" (type bytes32)
    let aliceCommit = "0x37e9ace32975b54d672f5f5535943ad91657e8745e0a740f13ba638157f3b329";
    // Bob: keccak256(1, "0xfff23244") Bob votes "Valid" or 1 (type uint) with a salt of "0xfff23244" (type bytes32)
    let bobCommit = "0x5ba0e331251da5367c55afa3e15936307c2ff51552fed2d4678b1704f9bf46cf";
    // Carlos: keccak256(0, "0xfff23245") Carlos votes "Invalid" or 0 (type uint) with a salt of "0xfff23245" (type bytes32)
    let carlosCommit = "0x7563dc86731c4d9242ca545a11171d0b710f9bf924444444ab015ff10d93603d";

    // Gas values. Feel free to modify these gas values if they are not sufficient...
    let gas = 4300000;
    let gasPrice = '40000000000'; //await web3.eth.getGasPrice();
    

    // Load the wallets (Externally Owned Accounts) of all participants in the poker protocol simulation.
    let wallets = JSON.parse(fs.readFileSync('wallets_private.json')); 
    let kuwaWallet = await loadWallet(wallets.keystore_dir, wallets.kuwa_foundation, wallets.password);
    let sponsorWallet = await loadWallet(wallets.keystore_dir, wallets.sponsor, wallets.password);
    let aliceWallet = await loadWallet(wallets.keystore_dir, wallets.alice, wallets.password);
    let bobWallet = await loadWallet(wallets.keystore_dir, wallets.bob, wallets.password);
    let carlosWallet = await loadWallet(wallets.keystore_dir, wallets.carlos, wallets.password);
    
    console.log("Loaded all wallets");

    // Compile all the smart contracts
    newCompilations = {};
    var kuwaTokenInput = {
        'ERC20Interface.sol': fs.readFileSync('../contracts/ERC20Interface.sol', 'utf8'),
        'SafeMath.sol': fs.readFileSync('../contracts/SafeMath.sol', 'utf8'),
        'Owned.sol': fs.readFileSync('../contracts/Owned.sol', 'utf8'),
        'KuwaToken.sol': fs.readFileSync('../contracts/KuwaToken.sol', 'utf8')
    };
    let compiledContract = solc.compile({sources: kuwaTokenInput}, 1);
    newCompilations['KuwaToken'] = {};
    newCompilations['KuwaToken'].abi = JSON.parse(compiledContract.contracts['KuwaToken.sol:KuwaToken'].interface);
    newCompilations['KuwaToken'].bytecode = /*'0x+'*/compiledContract.contracts['KuwaToken.sol:KuwaToken'].bytecode;

    var kuwaRegistrationInput = {
        'ERC20Interface.sol': fs.readFileSync('../contracts/ERC20Interface.sol', 'utf8'),
        'SafeMath.sol': fs.readFileSync('../contracts/SafeMath.sol', 'utf8'),
        'Owned.sol': fs.readFileSync('../contracts/Owned.sol', 'utf8'),
        'KuwaToken.sol': fs.readFileSync('../contracts/KuwaToken.sol', 'utf8'),
        'KuwaRegistration.sol': fs.readFileSync('../contracts/KuwaRegistration.sol', 'utf8')
    };
    compiledContract = solc.compile({sources: kuwaRegistrationInput}, 1);
    newCompilations['KuwaRegistration'] = {};
    newCompilations['KuwaRegistration'].abi = JSON.parse(compiledContract.contracts['KuwaRegistration.sol:KuwaRegistration'].interface);
    newCompilations['KuwaRegistration'].bytecode = compiledContract.contracts['KuwaRegistration.sol:KuwaRegistration'].bytecode;

    var qualifiedKuwaRegistrarInput = {
        'ERC20Interface.sol': fs.readFileSync('../contracts/ERC20Interface.sol', 'utf8'),
        'SafeMath.sol': fs.readFileSync('../contracts/SafeMath.sol', 'utf8'),
        'Owned.sol': fs.readFileSync('../contracts/Owned.sol', 'utf8'),
        'KuwaToken.sol': fs.readFileSync('../contracts/KuwaToken.sol', 'utf8'),
        'KuwaRegistration.sol': fs.readFileSync('../contracts/KuwaRegistration.sol', 'utf8'),
        'QualifiedKuwaRegistrar.sol': fs.readFileSync('../contracts/QualifiedKuwaRegistrar.sol', 'utf8')
    };
    compiledContract = solc.compile({sources: qualifiedKuwaRegistrarInput}, 1);
    newCompilations['QualifiedKuwaRegistrar'] = {};
    newCompilations['QualifiedKuwaRegistrar'].abi = JSON.parse(compiledContract.contracts['QualifiedKuwaRegistrar.sol:QualifiedKuwaRegistrar'].interface);
    newCompilations['QualifiedKuwaRegistrar'].bytecode = compiledContract.contracts['QualifiedKuwaRegistrar.sol:QualifiedKuwaRegistrar'].bytecode;

    console.log("Compiled all contracts");

    // Deploy all the smart contracts
    let kuwaToken = await deployContract(newCompilations['KuwaToken'].abi, newCompilations['KuwaToken'].bytecode,
                                     gas, gasPrice, wallets.kuwa_foundation, []);
    console.log("Deployed Kuwa Token contract");

    let kuwaRegistration;
    kuwaRegistration = await deployContract(newCompilations['KuwaRegistration'].abi, newCompilations['KuwaRegistration'].bytecode,
                                                gas, gasPrice, wallets.sponsor, [wallets.client, kuwaToken.options.address]);
    newCompilations['KuwaRegistration'].address = kuwaRegistration.options.address;
    console.log("Deployed Kuwa Registration contract");

    let aliceQKR, bobQKR, carlosQKR;
    aliceQKR = await deployContract(newCompilations['QualifiedKuwaRegistrar'].abi, newCompilations['QualifiedKuwaRegistrar'].bytecode,
                                        gas, gasPrice, wallets.alice, [kuwaToken.options.address]);
    bobQKR = await deployContract(newCompilations['QualifiedKuwaRegistrar'].abi, newCompilations['QualifiedKuwaRegistrar'].bytecode,
                                    gas, gasPrice, wallets.bob, [kuwaToken.options.address]);
    carlosQKR = await deployContract(newCompilations['QualifiedKuwaRegistrar'].abi, newCompilations['QualifiedKuwaRegistrar'].bytecode,
                                        gas, gasPrice, wallets.carlos, [kuwaToken.options.address]);
    newCompilations['QualifiedKuwaRegistrar'].alice_address = aliceQKR.options.address;
    newCompilations['QualifiedKuwaRegistrar'].bob_address = bobQKR.options.address;
    newCompilations['QualifiedKuwaRegistrar'].carlos_address = carlosQKR.options.address;
    
    console.log("Deployed all Qualified Kuwa Registrar contracts");

    // Have the KuwaToken contract owner transfer some tokens to participants.
    // Initially, the entity that deployed the token contract possesses all of the tokens
    console.log("--------------------------------------------------------------------------------------------"); 
    console.log("Initial transfer of Kuwa tokens to Sponsor and Registrar's QKR contracts");
    await kuwaToken.methods.transfer(wallets.sponsor, 200010).send({from: wallets.kuwa_foundation});
    await kuwaToken.methods.transfer(aliceQKR.options.address, 100010).send({from: wallets.kuwa_foundation});
    await kuwaToken.methods.transfer(bobQKR.options.address, 100010).send({from: wallets.kuwa_foundation});
    await kuwaToken.methods.transfer(carlosQKR.options.address, 100010).send({from: wallets.kuwa_foundation});

    console.log("Token balances for each participant of the protocol:");
    console.log(`Kuwa Foundation: ${await kuwaToken.methods.balanceOf(wallets.kuwa_foundation).call({from: wallets.kuwa_foundation})}`);
    console.log(`Sponsor: ${await kuwaToken.methods.balanceOf(wallets.sponsor).call({from: wallets.sponsor})}`);
    console.log(`Alice QKR: ${await kuwaToken.methods.balanceOf(aliceQKR.options.address).call({from: wallets.alice})}`);
    console.log(`Bob QKR: ${await kuwaToken.methods.balanceOf(bobQKR.options.address).call({from: wallets.bob})}`);
    console.log(`Carlos QKR: ${await kuwaToken.methods.balanceOf(carlosQKR.options.address).call({from: wallets.carlos})}`);
    
    // Begin the poker protocol simulation
    console.log("--------------------------------------------------------------------------------------------");
    console.log("Begin Poker protocol...");

    console.log("Sponsor providing required ante for incentive...");
    await kuwaToken.methods.approve(kuwaRegistration.options.address, 1).send({ from: wallets.sponsor })
    console.log("*********************************************************************************************");
    
    console.log("Begin voting process...");
    await aliceQKR.methods.vote(kuwaRegistration.options.address, aliceCommit, 1).send({from: wallets.alice})
    console.log("Alice has voted through its QKR contract (%s) with a committed hash of: %s", aliceQKR.options.address, aliceCommit)
    await bobQKR.methods.vote(kuwaRegistration.options.address, bobCommit, 1).send({from: wallets.bob})
    console.log("Bob has voted through its QKR contract (%s) with a committed hash of: %s", bobQKR.options.address, bobCommit)
    await carlosQKR.methods.vote(kuwaRegistration.options.address, carlosCommit, 1).send({from: wallets.carlos})
    console.log("Carlos has voted through its QKR contract (%s) with a committed hash of: %s", carlosQKR.options.address, carlosCommit)
    console.log("*********************************************************************************************");

    console.log("Get token balance for the Kuwa Registration contract...");
    console.log(await kuwaToken.methods.balanceOf(kuwaRegistration.options.address).call())
    console.log("*********************************************************************************************");

    console.log("Display voters' addresses...");
    console.log(await kuwaRegistration.methods.getVotersList().call())
    console.log("*********************************************************************************************");

    console.log("Registrars reveal their votes...");
    await aliceQKR.methods.reveal(kuwaRegistration.options.address, 1, "0xfff23243").send({from: wallets.alice})
    console.log("Alice has revealed.")
    console.log("Honest? %s", await aliceQKR.methods.isVoterHonest(kuwaRegistration.options.address).call())

    await bobQKR.methods.reveal(kuwaRegistration.options.address, 1, "0xfff23244").send({from: wallets.bob})
    console.log("Bob has revealed.")
    console.log("Honest? %s", await bobQKR.methods.isVoterHonest(kuwaRegistration.options.address).call())

    await carlosQKR.methods.reveal(kuwaRegistration.options.address, 0, "0xfff23245").send({from: wallets.carlos})
    console.log("Carlos has revealed.")
    console.log("Honest? %s", await carlosQKR.methods.isVoterHonest(kuwaRegistration.options.address).call())
    console.log("*********************************************************************************************");

    console.log("Sponsor decides the winner and the final status of the Kuwa client...")
    await kuwaRegistration.methods.decide().send({from: wallets.sponsor});
    console.log("The final status (0=Invalid, 1=Valid, 2=Tie): %d", await kuwaRegistration.methods.getFinalStatus().call());
    console.log("The dividend that each winner will receive as reward: %d", await kuwaRegistration.methods.getDividend().call());
    console.log("*********************************************************************************************");

    console.log("Winning registrars collect their dividend...Losing registrars will get a txn revert!")
    console.log("Alice claims her reward.")
    await aliceQKR.methods.payout(kuwaRegistration.options.address).send({from: wallets.alice});
    console.log("Alice's QKR contract token balance: %d", await kuwaToken.methods.balanceOf(aliceQKR.options.address).call());
    console.log("Bob claims his reward.")
    await bobQKR.methods.payout(kuwaRegistration.options.address).send({from: wallets.bob});
    console.log("Bob's QKR contract token balance: %d", await kuwaToken.methods.balanceOf(bobQKR.options.address).call());
    //await carlosQKR.methods.payout(kuwaRegistration.options.address).send({from: wallets.alice});
    console.log("Carlos cannot claim his reward!")
    console.log("Carlos's QKR contract token balance: %d", await kuwaToken.methods.balanceOf(carlosQKR.options.address).call());
}

run().catch(err => console.log(err));
