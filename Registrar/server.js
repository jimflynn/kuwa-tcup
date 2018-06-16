const mysql = require('mysql');
const express = require('express');
const port = process.env.PORT || 8081;

const app = express();

var pool = mysql.createPool({
    connectionLimit : 100,
    host     : 'localhost',
    user     : 'root',
    password : 'sqlpassword',
    database : 'alpha_kuwa_registrar_moe',
    timezone : 'local',
    dateStrings : true
});

app.get('/registration', (req, res) => {
    pool.getConnection((error,connection) => {
        if (error) {
            res.json({"code" : 100, "status" : "Error in connecting to database"});
            return;
        }
        console.log('UI backend has connected to Kuwa database!');
        connection.query("SELECT * FROM registration", (err,rows) => {
            if (!err) {
                connection.release();
                rows = JSON.parse(JSON.stringify(rows));
                res.json(rows);
            }
            else {
                res.json({"code" : 100, "status" : "Error in querying database"});
                return;
            }
        });
        connection.on('error', (err) => {
            res.json({"code" : 100, "status" : "Error in connecting to database"});
            return;
        })
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
