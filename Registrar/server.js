/*
 * @file Backend server for the Moe Registrar User Interface.
 * @author The Kuwa Foundation / Priyadarshi Rath
 */

const fs      = require('fs');
const https   = require('https');
const express = require('express');
const pool    = require("./mysql_pool.js");
const moment  = require('moment-timezone');
const port    = process.env.PORT || 3006;
const app     = express();

var credentials = {
	key : fs.readFileSync('./server.key'),
	cert: fs.readFileSync('./server.cert')
}

/*
 * @function get
 * @description Fetches the registrations table using GET.
 */
app.get('/registration', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	pool.getConnection((error,connection) => {
		if (error) {
			return res.json({"code" : 100, "status" : "Error in connecting to database"});
		}
		// console.log('UI backend has connected to Kuwa database!');
		connection.query("SELECT * FROM registration", (err,rows) => {
			if (!err) {
				connection.release();
				rows = JSON.parse(JSON.stringify(rows));
				// convert time to EDT
				let numRows = rows.length;
				for(let i=0; i < numRows; i++) {
					rows[i].timestamp = moment(rows[i].timestamp).tz("America/New_York").format('YYYY-MM-DD HH:mm:ss');
				}
				//console.log(rows);
				return res.json(rows);
			}
			else {
				return res.json({"code" : 100, "status" : "Error in querying database"});
			}
		});
		connection.on('error', (err) => {
			return res.json({"code" : 100, "status" : "Error in connecting to database"});
		})
	});
});

/*
 * @function get
 * @description Fetches the valid registrations from the table using GET.
 */
app.get('/get_valid_ids', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	pool.getConnection((error,connection) => {
		if (error) {
			return res.json({"code" : 100, "status" : "Error in connecting to database"});
		}
		connection.query("SELECT * FROM registration WHERE status=\"Valid\"", (err,rows) => {
			if (!err) {
				connection.release();
				rows = JSON.parse(JSON.stringify(rows));
				// convert time to EDT
				let numRows = rows.length;
				for(let i=0; i < numRows; i++) {
					rows[i].timestamp = moment(rows[i].timestamp).tz("America/New_York").format('YYYY-MM-DD HH:mm:ss');
				}
				return res.json(rows);
			}
			else {
				return res.json({"code" : 100, "status" : "Error in querying database"});
			}
		});
		connection.on('error', (err) => {
			return res.json({"code" : 100, "status" : "Error in connecting to database"});
		})
	});
});

/*
 * Starts the server for the Registrar User Interface.
 * @param  {Object}  credentials
 * @param  {Express} app
 * @return {void}
 */
https.createServer(credentials, app).listen(port, function () {
	console.log('Server listening on port ' + port);
});
