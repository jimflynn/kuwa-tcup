# Registrar Module

This module inspects Kuwa registration requests. It interfaces with Kuwa registration smart contracts running on an Ethereum blockchain via Web3js. If a registrar determines that the request is valid, it votes on the registration. 

In the initial TCUP implementation, we only ran one registrar. Consequently, that one vote determines the status of the registration. For our testing, we ran multiple registrars, which is far more interesting since the outcome of the vote determines the status of the registration. Registrars are independent, rational and selfish nodes. We are designing the incentive system in Kuwa to ensure that independent registrars will perform tasks that reinforce the Kuwa ID network.


## Getting Started

IMPORTANT: 

1. This module (and other TCUP modules) typically define sensitive configuration settings (passwords, etc.) in a private properties file (config_private.json). When you clone the repo, however, you should see files named config.json, which contain dummy settings. Rename or copy these files to config_private.json. Then edit those files to include the appropriate private information for your implementation.

2. If you have running multiple TCUP modules on the same server, then you will likely have to add a .ENV file with the contents "DANGEROUSLY_DISABLE_HOST_CHECK=true" to this module's folder.

To get started, please follow these instructions:

From the api subdirectory, run:

    npm install

You should have the latest verion of MySQL installed. This module's root folder contains the required database schema in alpha_kuwa_registrar_moe.sql.

You should have the latest verion of MySQL installed. This module's root folder contains the required database schema in alpha_kuwa_registrar_moe.sql.

The registrar consists of three parts:

1. The Watcher module, which watches a specified folder and performs sybil detection on new additions. It may use either of two methods, depending on which one is used for execution:

   a. File Hashing using sha256 - see the readme in the subdirectory fileHash for more info.
   b. Face recognition using face-recognition and opencv4nodejs - see the readme in the subdirectory faceRecognition for more info.

2. The backend module, which fetches data from a MySQL database.

3. The frontend module, which takes the data served from the backend and displays it in a tabular fashion.

Starting the Registrar:

First, select a the watcher you want to see in action and go to either `fileHash` or `faceRecognition` to run the respective watcher module.

Second, start the backend from the `backend` module.

Finally, start the frontend react app from the frontend module.

Quick Start:

For the registrar based on file hashing, run ./registrar_hash.sh.
For the registrar based on face recognition, run ./registrar_face.sh.
