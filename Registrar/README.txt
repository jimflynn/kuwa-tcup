Dependencies:

web3         : npm install web3 --save
mysql        : npm install mysql
nodemon      : npm install nodemon -g (may need sudo)
express      : npm install express
chokidar     : npm install chokidar --save
concurrently : npm install concurrently -g (may need sudo)

Project was setup using create-react-app : npm install -g create-react-app

To start, type `npm start`. This command starts the watcher and the UI as concurrent processes, in separate cores.

Database : Kuwa
Table in Database : Regs
Schema for Regs: Regs( client_address varchar(50), client_contract_address varchar(50), timestamp varchar(50), status varchar(1))

TODO:
1. Since I did not have access to the storage manager, I hard-coded the client address and the contract address. This will need to be changed in the future when we test a round trip.
