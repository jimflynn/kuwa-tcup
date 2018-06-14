Kuwa Registrar
Author: Priyadarshi Rath

Dependencies:

mysql    : npm install mysql
web3     : npm install web3 --save
chokidar : npm install chokidar --save
express  : npm install express

To install all dependencies, type `npm install` where package.json is located.

NOTE: Since the UI is in the client folder with its own dependencies, you will need to install dependencies with respect to the `client` folder as well.

UI was setup using create-react-app : npm install -g create-react-app

Database : alpha_kuwa_registrar_moe
Table in Database : registration
Schema for registration: 

+------------------+-------------+------+-----+-------------------+----------------+
| Field            | Type        | Null | Key | Default           | Extra          |
+------------------+-------------+------+-----+-------------------+----------------+
| registration_id  | int(32)     | NO   | PRI | NULL              | auto_increment |
| client_address   | varchar(50) | YES  |     | NULL              |                |
| contract_address | varchar(50) | YES  |     | NULL              |                |
| timestamp        | timestamp   | NO   |     | CURRENT_TIMESTAMP |                |
| status           | tinyint(4)  | YES  |     | NULL              |                |
+------------------+-------------+------+-----+-------------------+----------------+

TODO:
1. Since I did not have access to the storage manager, I hard-coded the client address and the contract address. This will need to be changed in the future when we test a round trip.
