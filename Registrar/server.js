const mysql = require('mysql');

const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

var pool      =    mysql.createPool({
    connectionLimit : 100,
    host     : 'localhost',
    user     : 'root',
    password : 'sqlpassword',
    database : 'alpha_kuwa_registrar_moe',
    timezone : 'local',
    dateStrings : true
});

app.get('/get_registrations', (req, res) => {

    pool.getConnection((err,connection) => {

        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('UI backend has connected to Kuwa database!');

        connection.query("select * from registration", (err,rows) => {
            connection.release();
            rows = JSON.parse(JSON.stringify(rows));
            res.json(rows);
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
