var mysql = require('mysql');
var fs = require("fs");
var properties = fs.readFileSync("config_private.json"); 
properties = JSON.parse(properties);

var pool = mysql.createPool({
  connectionLimit : 100,
  host            : properties['sqlhost'],
  user            : properties['sqluser'],
  password        : properties['sqlPass'],
  database        : properties['db']
});

module.exports = pool;
