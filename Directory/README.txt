NOTE:

`scan.js`  should be run as a cron job to get the most recent statuses of the clients.
The API server `server.js` must be running before the client/ React UI is started.


TODO:

- Figure out how to populate the 'application_binary_interface' table and store and retrieve the ABI.
The ABI does not change as often and therefore we do not need to store it in every client directory.
Right now, the 'application_binary_interface_id' is set to 1 for every client.

- Insert rows into the table in batch (it is much more efficient)

CONCERNS:

- If IPFS is used as the storage system, this directory service process can take very long due
to the high network latency of reading files from remote IPFS nodes.
