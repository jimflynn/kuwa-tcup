**ReadME for building and starting Storage Manager service**

1. After copying the contents of the StorageManager dir and going into the dir, run 'npm install' to get the required packages.

2. Stop any existing  storage manager processes running ('forever stop StorageManager.js', check for processes on port 3003 by running 'lsof -i:3003' and use 'kill -9 {pid}' to kill any existing processes

3. Run 'forever start StorageManager.js' to  start the storage amnager service which is ready to receive POST requests with the client details and the challenge video and places them in the '/registrations' dir.