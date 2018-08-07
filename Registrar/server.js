var fs = require('fs');
var https = require('https');
const mysql = require('mysql');
const express = require('express');
var moment = require('moment-timezone');
const port = process.env.PORT || 3006;

const app = express();

var pool = mysql.createPool({
    connectionLimit : 100,
    host: "localhost",
    user: "moe",
    password: "Moe@Alpha123",
    database: "alpha_kuwa_registrar_moe",
    timezone : '-04:00',
    dateStrings : true
});

var credentials = {
    key : fs.readFileSync('/etc/httpd/conf/ssl.key/server.key'),
    cert: fs.readFileSync('/etc/httpd/conf/ssl.crt/alpha_kuwa_org.pem')
}

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

https.createServer(credentials, app).listen(port, function () {
    console.log('Server listening on port ' + port);
});
