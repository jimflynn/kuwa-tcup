const fs = require('fs');
const mysql = require('mysql');
const sprintf = require('sprintf-js').sprintf;

// Create pool of DB connections
let configFilePath = "config.json";
let config = JSON.parse(fs.readFileSync(configFilePath));

const pool = mysql.createPool({
    host: config['db_client'].host,
    user: config['db_client'].user,
    password:  config['db_client'].password,
    database: config['db_client'].database,
    connectionLimit: config['db_client'].connection_limit
});


/* Get the selected columns from "config.json" converted to display format,
We can perhaps put the column mappings as another table in the DB?
*/
let cols = (function getCols() {
  let columns = config['db_client']['columns'];
  let selectedCols = columns['selected'];
  let cols = "";
  let delim = ",";
  for (let i = 0; i < selectedCols.length; i++) {
      if (i == selectedCols.length - 1) {
          delim = "";
      }
      cols += selectedCols[i] + " AS " + "'" + columns["mapping"][selectedCols[i]] +  "'" + delim;
    }
    if (cols == "")
        return "*";

    return cols;
});

function getAll() {
    command = sprintf(`SELECT %s FROM registration`, cols);  //TODO: Update last_checked
    return new Promise((resolve, reject) => {
        pool.query(command,
             function(err, rows, fields) {
                if (err) throw reject(err);
                resolve(JSON.stringify(rows));
             }
        )
    })
};

/*
Join with another SQL table? Yes, much more elegant solution. Right now, we have to take out "status"
from "selected" in "config.json" or else there would be two "status" columns. You  also can't order columns.
We can put status mappings in the "config.json" but that doesn't look right and is a bit hacky.
See https://stackoverflow.com/questions/16753122/sql-how-to-replace-values-of-select-return
*/
function getAllWithStatus(status) {
    status = status.replace("-", " ");
    command = sprintf(`SELECT
                        %s FROM registration
                        WHERE status = %s`, cols, status);   //TODO: Update last_checked
    return new Promise((resolve, reject) => {
        pool.query(command,
            function(err, rows, fields) {
                if (err) reject(err);
                resolve(JSON.stringify(rows));
             }
        )
    });
};

/* Non promise-based by passing Express' response object to function*/
/*function getAll(res) {
    command = sprintf(`SELECT %s from registration`, cols);    //TODO: Update last_checked
    pool.query(command,
        function(err, rows, fields) {
            if (err) throw err;
            res.json(JSON.stringify(rows));
         }
    )
};*/

module.exports = {
    getAll: getAll,
    getAllWithStatus: getAllWithStatus
}
