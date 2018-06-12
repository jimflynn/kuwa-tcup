const mysql = require('mysql');

const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

var pool      =    mysql.createPool({
    connectionLimit : 100,
    host     : 'localhost',
    user     : 'root',
    password : 'sqlpassword',
    database : 'Kuwa',
    debug    :  false
});

app.get('/registrations', (req, res) => {

    pool.getConnection((err,connection) => {

        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('Server connected to Kuwa as id ' + connection.threadId);

        connection.query("select * from Regs", (err,rows) => {
            connection.release();
            if(!err) {
                res.json(rows);
                console.log(rows);
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
