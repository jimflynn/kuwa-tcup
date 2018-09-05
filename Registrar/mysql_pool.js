const fs = require('fs');
const mysql   = require('mysql');

var props = fs.readFileSync("/var/deploy/tcup/Registrar/properties_private.json", "utf-8");
props = JSON.parse(props);

let pool = mysql.createPool({
	connectionLimit : 100,
	host: props["sqlhost"],
	user: props["sqluser"],
	password: props["sqlpassword"],
	database: props["sqldatabase"],
	timezone : 'local',
	dateStrings : true
});

module.exports = pool;
