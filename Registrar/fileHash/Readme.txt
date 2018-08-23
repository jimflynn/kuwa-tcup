This is a simple readme for the Kuwa Registrar module that uses Face Recognition for Sybil Detection.

**********
Commands for running this module:
**********

To install dependencies:
$ npm install

To keep the registrar forever turned on:
$ npm install -g forever
$ forever start watcher_fileHash.js

=========
NOTE: You may need sudo privileges to run npm install with the global flag.
=========

**********
To generate documentation:
**********

$ npm install documentation
$ documentation build <file(s)_or_folder(s)> -f html -o docs
