**Build Instructions for Faucet**

1. Assuming you have nodeJS and npm installed, run 'npm install' from the Faucet dir to install all teh required modules

2. Run 'testrpc' command to start a local network in a separate terminal, update the port number of this network in truffle.js (if different from localhost:8545)

3. Next , run 'truffle compile' and then 'truffle migrate', note the address the KuwaFaucet contract is deployed to. 

4. Replace the contract address referenced in server.js(line 91 and line 93)

5. Start eh node.js server by running 'node server.js'

6. Open localhost:3000 to make the request to get valid Kuwa IDs.