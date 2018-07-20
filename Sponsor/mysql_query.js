var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit : 100,
  host            : 'localhost',
  user            : 'thelma',
  password        : 'Manushgupta123!',
  database        : 'alpha_kuwa_sponsor_thelma'
});

module.exports = pool;
