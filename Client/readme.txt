Instructions for building and running the client:

1. Install nodeJS, npm


2. Run 'npm install' ,  this will install all the required modules listed as dependencies in package.json


3. index.js file contains the methods to generate key pair, call storagemanger service.
We are using browserify to import node modules on the client side instead of running a nodejs server.

After making any changes in index.js, please run the command 'browserify index.js -o bundle.js' to build the bundle containing the dependencies.

4. Open index.html in the browser and enter the secret (default value: 'secret') and an Ethereum wallet will be generated and the key pair will be displayed.