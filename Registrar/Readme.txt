This is a simple readme for the Kuwa Registrar module.

*** Commands for the watcher and User Interface server (must be run from tcup/Registrar) ***

To install dependencies:
$ npm install

To launch the watcher and User Interface backend:
$ npm start

To launch as forever services:
$ forever start watcher.js && forever start server.js



*** Commands for the registrar User Interface frontend (must be run from tcup/Registrar/client) ***

To install dependencies:
$ npm install

To launch the User Interface:
$ npm start

To start as a forever service:
$ forever start -c "npm start" ./



*** To compile all source code into a tarball (must be run from tcup/Registrar) ***
$ tar --exclude="./node_modules/*" --exclude="./client/node_modules/*" -zcvf kuwa.tar.gz .



*** To generate documentation ***
$ npm install documentation
$ documentation build <file(s)_or_folder(s)> -f html -o docs
