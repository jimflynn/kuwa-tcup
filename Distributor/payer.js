const fs        = require("fs");
const debug     = true;
const mysql     = require('mysql');
const KuwaCoin  = require('./KuwaCoin');
const properties= JSON.parse(fs.readFileSync("config_private.json"));
const kuwaCoinABI = JSON.parse(fs.readFileSync('./KuwaCoinABI.json', 'utf-8'));

function getDBConnection() {
  dbCon = mysql.createConnection({
    host: properties["db_host"],
    user: properties["db_user"],
    password: properties["db_password"],
    database: properties["db"]
  });
  dbCon.connect(function(err) {
    if (err) throw err;
  });
}

async function createKuwaCoin() {
  dbg('In createKuwaCoin');
  var config = {
    eth_network_url: properties.eth_client.eth_network_url,
    abi: kuwaCoinABI,
    contract_address: properties.kuwa_coin.contract_address,
  }
  await new KuwaCoin
    (
      properties.eth_client.eth_network_url,
      kuwaCoinABI,
      properties.kuwa_coin.contract_address,
      setKuwaCoin
    );
}

var kuwaCoin = null;
function setKuwaCoin(kc) {
  dbg('In setKuwaCoin');
  kuwaCoin = kc;
}

async function processPayees() {
  dbg('In SDsdd getPayees');
  await dbCon.query("SELECT * FROM payee", function (err, result, fields) {
    if (err) {
      console.log('A DB error occured in the getPayees method. Error Code: ' + err.code);
    }
    if ( result.length == 0 ) {
      console.log('No payees found.');
    }
    else {
      console.log(result.length + ' payees found.');
      makePayments(result);
    }
  });
}

async function sendKuwaCoin(amount, kuwaID) {
  console.log("\nSending KuwaCoin to " + kuwaID);
  var config = {
    amount: amount,
    contract_address: properties.kuwa_coin.contract_address,
    to: kuwaID,
    from: properties.kuwa_coin.wallet_address,
    privateKey: properties.kuwa_coin.wallet_private_key,
    callBack: null,
    workObj: {}
  }
  await kuwaCoin.transfer(config);
}

async function makePayments(payees) {
  console.log('Found ' + payees.length + ' payees.');
  for(var i = 0 ;i < payees.length; i++) {
      var kuwaID = payees[i].kuwa_id;
      await sendKuwaCoin(1, kuwaID);
      recordPayment(payees[i].payee_id, 1);
  }
  dbCon.end();
  console.log('Finished!');
  process.exit();
}

async function recordPayment(payeeID, tokenAmount) {
  dbg('In recordPayment');
  let statement = "INSERT INTO payment (payee_id, tokens) " +
    "VALUES ('" + payeeID + "', " + tokenAmount + ")";
  dbg('Executing SQL statement: ' + statement);
  dbCon.query(statement, function (err, result, fields) {
    if (err) {
      console.log('A DB error occured in the recordPayment method. Error Code: ' + err.code);
      return;
    }
    dbg('Recorded sending  ' + tokenAmount + ' KuwaToken(s) to payee ID ' + payeeID);
  });
}

function dbg(text) {
  if (debug) console.log(text);
}

var dbCon;

async function main() {
  console.log('Starting KuwaCoin Basic Income Payment Process.');
  createKuwaCoin();
  await getDBConnection();
  processPayees()
}

main();
