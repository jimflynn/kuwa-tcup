This is a simple readme for the Kuwa Registrar module.

*** Commands for the watcher and User Interface server (must be run from tcup/Registrar) ***

To install dependencies:
$ npm install

=========
NOTES:
1. For Ubuntu-based distributions, face-recognition needs cmake, libpng, libx11. 
   Please check equivalents for other platforms(if you are using them) and make sure they are installed first.
2. opencv4nodejs needs cmake. Make sure it is installed first.
=========

To launch the watcher and User Interface backend in development mode:
$ npm start

To keep the registrar based on file hashing forever turned on:
$ npm install -g forever
$ forever start watcher_fileHash.js && forever start server.js

To keep the registrar based on face recongition forever turned on:
$ npm install -g forever
$ forever start watcher_faceRecognition.js && forever start server.js

=========
NOTE: You may need sudo privileges to run npm install with the global flag.
=========


*** Commands for the registrar User Interface frontend (must be run from tcup/Registrar/client) ***

To install dependencies:
$ npm install

To launch the User Interface:
$ npm start

To keep running forever:
$ npm install -g forever
$ forever start -c "npm start" ./



*** To zip all source code into a tarball (must be run from tcup/Registrar) ***
$ tar --exclude="./node_modules/*" --exclude="./client/node_modules/*" -zcvf kuwa.tar.gz .



*** To generate documentation ***
$ npm install documentation
$ documentation build <file(s)_or_folder(s)> -f html -o docs
