# Sponsor Module

This module sponsors Kuwa registration requests. It pays for those requests by providing the "gas" needed to deploy Kuwa registration contracts on Ethereum blockchains. 


## Getting Started

IMPORTANT: 

1. This module (and other TCUP modules) typically define sensitive configuration settings (passwords, etc.) in a private properties file (config_private.json). When you clone the repo, however, you should see files named config.json, which contain dummy settings. Rename or copy these files to config_private.json. Then edit those files to include the appropriate private information for your implementation.

2. If you have running multiple TCUP modules on the same server, then you will likely have to add a .ENV file with the contents "DANGEROUSLY_DISABLE_HOST_CHECK=true" to this module's folder.

To get started, please follow these instructions:

From the api subdirectory, run:

    npm install

You should have the latest verion of MySQL installed. This module's root folder contains the required database schema in alpha_kuwa_sponsor_thelma.sql.

To start server.js, run:

    npm start server.js 

    or

    forever start server.js

Tips:

* Stop any existing  Kuwa Faucet processes running ('forever stopall', check for processes on port 3015 by running 'lsof -i:3015' and use 'kill -9 {pid}' to kill any existing processes

* Start the react app by running 'npm start' or 'forever start -c "npm start" ./' to keep the server running

* Open localhost:3015(if running locally) or alpha.kuwa.org:3015 to make the request to get valid Kuwa IDs.


The user-facing interface for this module is stored in the sponsor_ui subfolder.
