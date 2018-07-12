**Build Instructions for Faucet**

1. Assuming you have nodeJS and npm installed, run 'npm install' from the Faucet dir to install all the required modules. Also , run 'npm install -g create-react-app'

2. Run 'testrpc' command to start a local network in a separate terminal, update the port number of this network in truffle.js (if different from localhost:8545)

3. Next , run 'truffle compile' and then 'truffle migrate', note the address the KuwaFaucet contract is deployed to. 

4. Replace the contract address referenced in server.js

5. Start the react app by running 'npm start'

6. Open localhost:3000 to make the request to get valid Kuwa IDs.


7.