const express = require('express');
const fs = require('fs');
const mysql = require('mysql');
const app = express();


// Set port
app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
console.log("NODE_ENV: ", process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

//==================== ROUTES ============================
app.get('/', function(req, res) {
    res.json("Welcome");
});

let api = require('./routes/api');
app.use('/api', api);

// Listen and serve
app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});
