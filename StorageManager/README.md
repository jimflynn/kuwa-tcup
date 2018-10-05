# StorageManager Module

Eventually, we will use a decentralized storage platofrorm, such as IPFS or FileCoin, to store data related to Kuwa registration requests. This module provides a short-term solution in that it stores request data in a directory path. Kuwa clients call this module.


## Getting Started

IMPORTANT: This module (and other TCUP modules) typically define sensitive configuration settings (passwords, etc.) in a private properties file (config_private.json). When you clone the repo, however, you should see files named config.json, which contain dummy settings. Rename or copy these files to config_private.json. Then edit those files to include the appropriate private information for your implementation.


To get started, please follow these instructions:

From the api subdirectory, run:

    npm install

To start server.js, run:

    npm start StorageManager.js 

    or

    forever start StorageManager.js

