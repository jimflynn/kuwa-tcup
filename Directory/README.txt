directory.js

This program scans the directory in the Kuwa Storage Manager registrations repository
containing the client directories with the client address as the name of the directory.
The directory hierarchy is as follows:

rootDir/
    0x6dc989e6d3582f5c3da1fd510a5b0ad950d67f3a/
        - info.json
            {
             "clientAddress": "0x6dc989e6d3582f5c3da1fd510a5b0ad950d67f3a",
             "contractAddress": "0x066335f8A852A6A0C2761e82829524eb8C950515",
             "contractABI": "[{\"constant\":true,\"inputs\":[],..."
            }
        - video.mp4

Each client directory will contain an 'info.json', which will contain the client address,
the client's contract address, and the contract JSON ABI. It will also contain the video
recording of the client speaking the challenge phrase.

The program will read the information necessary to load the client's smart contract in
order to call the getRegistrationStatus() function to obtain the status of the client:
VALID (1) or INVALID (0).

It will then store this information into the 'registration' table of the MySQL DB so that
one can retrieve all Kuwa/Client addresses that are valid or invalid.

Since loading the contract does not take long and calling a view function on the contract
to read a value is relatively fast, this procedure can probably be done periodically even
with ~1 million clients. Stress tests however have to be performed to confirm that processing
that many directories is not time consuming (preferably taking less than one hour).

TODO:

- Have the ability to UPDATE the table. If this program is executed again, it has to update
the status of the client along with the updated and last_checked columns and not insert a new row
(causing duplicate rows).

- Figure out how to populate the 'application_binary_interface' table and store and retrieve the ABI.
The ABI does not change as often and therefore we do not need to store it in every client directory.
Right now, the 'application_binary_interface_id' is set to 1 for every client.

- Insert rows into the table in batch (it is much more efficient)

- Be able to securely provide the password to create a MySQL connection and not hardcode it.

- Be able to securely provide the information needed for loadWallet() so that one can load his/her
wallet credentials to make calls to the client smart contract. It is hardcoded for now.

- Be able to provide the registration directory without hardcoding it.

- Run this on alpha.kuwa.org and change the column types of 'kuwa_address' and 'contract_address'
to VARCHAR(42) since Ethereum addresses are usually expressed in "0x..." string format.
Right now, this program is tested on a local MySQL DB using a local 'test/' directory.

- Import the loadWallet() and loadContract() functions originally residing in another src/ directory
and not copy/paste it for reuse.

CONCERNS:

- If IPFS is used as the storage system, this directory service process can take very long due
to the high network latency of reading files from remote IPFS nodes.



getKuwaIds.js

This program simply queries the DB for all valid Kuwa/Client addresses.
