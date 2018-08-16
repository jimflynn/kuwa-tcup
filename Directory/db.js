/**
 * This file contains functions to query the `registrations` table in the 
 * `alpha_kuwa_directory` database to support the API in `./routes/api.js`.
 */

const fs = require('fs');
const mysql = require('mysql');
const sprintf = require('sprintf-js').sprintf;

let configFilePath = "config.json";
let config = JSON.parse(fs.readFileSync(configFilePath));   // Read from config file

// Create a pool of DB connections
const pool = mysql.createPool({
    host: config['db_client'].host,
    user: config['db_client'].user,
    password:  config['db_client'].password,
    database: config['db_client'].database,
    connectionLimit: config['db_client'].connection_limit
});


/**
 * Get the selected columns from "config.json" converted to proper display format for the UI.
 * We can perhaps have the column mappings as another table in the registration DB?
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


/**
 * Get all Kuwa clients regardless of their status.
 * 
 * @returns {Promise} A Promise object containing the rows of the query
 */
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

/**
 * Get Kuwa clients with a certain status ("Valid", "Invalid", "Credentials-Provided", "Challenge-Expired", "Video-Uploaded", "QR-Code-Scanned").
 * 
 * Join with another SQL table? We can put status mappings in the "config.json" 
 * but that doesn't look right and is a bit hacky.
 * See https://stackoverflow.com/questions/16753122/sql-how-to-replace-values-of-select-return
 * 
 * @param {string} status - The status of the Kuwa client
 * @returns {Promise} A Promise object containing the rows of the query
 */
function getAllWithStatus(status) {
    status = status.replace("-", " ");
    command = sprintf(`SELECT
                        %s FROM registration
                        WHERE status = '%s'`, cols, status);   //TODO: Update last_checked
    return new Promise((resolve, reject) => {
        pool.query(command,
            function(err, rows, fields) {
                if (err) reject(err);
                resolve(JSON.stringify(rows));
             }
        )
    });
};

/* Non promise-based by passing Express' response object to function */
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
