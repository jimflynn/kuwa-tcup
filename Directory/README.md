# Directory Module

This module scans the repository path for Kuwa registration info. It stores Kuwa registrations in an SQL database. 

You should run scan.js as a cron job to get the most recent registration statuses. The API server server.js must be running before the client/ React UI is started.


## Getting Started

IMPORTANT: 

1. This module (and other TCUP modules) typically define sensitive configuration settings (passwords, etc.) in a private properties file (config_private.json). When you clone the repo, however, you should see files named config.json, which contain dummy settings. Rename or copy these files to config_private.json. Then edit those files to include the appropriate private information for your implementation.

2. If you have running multiple TCUP modules on the same server, then you will likely have to add a .ENV file with the contents "DANGEROUSLY_DISABLE_HOST_CHECK=true" to this module's folder.

To get started, please follow these instructions:

From the root folder, run:

    npm install

You should have the latest verion of MySQL installed. This module's root folder contains the required database schema in alpha_kuwa_directory.sql.

To start server.js, run:

    npm start server.js 

    or

    forever start server.js

Typically, you would want to run the scan.js program once per day as a batch job (e.g., via crontab).  To execute payer.js from the command line, run:

    node scan.js   

The user-facing interface for this module is stored in the client subfolder.
 