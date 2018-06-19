var mysql = require('mysql');

var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'test'
});

conn.connect();

command = "SELECT kuwa_address from registration \
            WHERE status = 1";
conn.query(command, function(err, results, fields) {
    if (err) {
        console.log(err);
    }

    if (results) {
        console.log(results);
    }
});

conn.end();
