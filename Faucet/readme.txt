**Build Instructions for Faucet**

1. Assuming you have nodeJS and npm installed, run 'npm install' from the Faucet dir to install all the required modules. Also , run 'npm install -g create-react-app'

2. Stop any existing  Kuwa Faucet processes running ('forever stopall', check for processes on port 3015 by running 'lsof -i:3015' and use 'kill -9 {pid}' to kill any existing processes

3. Start the react app by running 'npm start' or 'forever start -c "npm start" ./' to keep the server running

4. Open localhost:3015(if running locally) or alpha.kuwa.org:3015 to make the request to get valid Kuwa IDs.