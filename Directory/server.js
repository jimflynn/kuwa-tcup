/**
 * This file contains the configurations for running the Express server that
 * will serve API requests for the API specified in `./routes/api.js`.
 * 
 * To run:
 * $ node server.js
 * 
 * To run using forever:
 * $ forever start server.js
 */

const express = require('express');
const fs = require('fs');
const mysql = require('mysql');
const app = express();


// Set port
app.set('port', (process.env.PORT || 3010));

// Express only serves static assets in production
console.log("NODE_ENV: ", process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Set default routes
app.get('/', function(req, res) {
  res.json("Welcome");
});

// Set the API route
let api = require('./routes/api');
app.use('/api', api);

// Listen and serve
app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});
