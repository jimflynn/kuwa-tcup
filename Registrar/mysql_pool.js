const mysql   = require('mysql');

let pool = mysql.createPool({
	connectionLimit : 100,
	host: "localhost",
	user: "root",
	password: "sqlpassword",
	database: "alpha_kuwa_registrar_moe",
	timezone : 'local',
	dateStrings : true
});

module.exports = pool;
