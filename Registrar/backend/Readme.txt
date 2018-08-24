This is a simple readme for the Kuwa Registrar backend.

**********
Commands for running this module:
**********

To install dependencies:
$ npm install

To keep the server forever turned on:
$ npm install -g forever
$ forever start server.js

=========
NOTE: You may need sudo privileges to run npm install with the global flag.
=========

**********
To generate documentation:
**********

$ npm install documentation
$ documentation build <file(s)_or_folder(s)> -f html -o docs
