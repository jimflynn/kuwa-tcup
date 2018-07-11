const fs = require('fs');
const mysql = require('mysql');

// Create pool of DB connections
let configFilePath = "config.json";
let config = JSON.parse(fs.readFileSync(configFilePath));

const pool = mysql.createPool({
    host: config['db_client'].host,
    user: config['db_client'].user,
    password:  config['db_client'].password,
    database: config['db_client'].database,
    connectionLimit: 10, // Hardcoded. Put in config.json.
});

function getAll() {
    command = `SELECT * from registration`; //TODO: Update last_checked
    return new Promise((resolve, reject) => {
        pool.query(command,
             function(err, rows, fields) {
                if (err) throw reject(err);
                resolve(JSON.stringify(rows));
             }
        )
    })
};

function getAllValid(res) {
    command = `SELECT * from registration WHERE status = 1`;    //TODO: Update last_checked
    return new Promise((resolve, reject) => {
        pool.query(command,
            function(err, rows, fields) {
                if (err) reject(err);
                resolve(JSON.stringify(rows));
             }
        )
    });
};

function getAllInvalid(res) {
    command = `SELECT * from registration WHERE status = 0`;    //TODO: Update last_checked
    pool.query(command,
        function(err, rows, fields) {
            if (err) throw err;
            res.json(JSON.stringify(rows));
         }
    )
};

module.exports = {
    getAll: getAll,
    getAllValid: getAllValid,
    getAllInvalid: getAllInvalid
}
