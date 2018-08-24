This is a simple readme for the Kuwa Registrar module that uses Face Recognition for Sybil Detection.

**********
Commands for running this module:
**********

To install dependencies:
$ npm install

=========
NOTES:
1. For Ubuntu-based distributions, face-recognition needs cmake, libpng, and libx11 libraries. 
   Please check equivalents for other platforms(if you are using them) and make sure they are installed first.
2. opencv4nodejs needs cmake. Please make sure it is installed first.
=========

To keep the registrar forever turned on:
$ npm install -g forever
$ forever start watcher_faceRecognition.js

=========
NOTE: You may need sudo privileges to run npm install with the global flag.
=========

**********
To generate documentation:
**********

$ npm install documentation
$ documentation build <file(s)_or_folder(s)> -f html -o docs
