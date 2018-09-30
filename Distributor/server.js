const express   = require('express');
const fs        = require("fs");
const https 	  = require("https");
const options 	= {
  			key: fs.readFileSync("/etc/httpd/conf/ssl.key/server.key"),
  			cert: fs.readFileSync("/etc/httpd/conf/ssl.crt/alpha_kuwa_org.pem")
		};
const app       = express();

// Cors is required in order to make calls to this API via SSL.
var cors = require('cors');
app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));
const debug     = true;
const port      = 3020; // Non SSL port.
const router    = express.Router();
const mysql     = require('mysql');

const KuwaRegistrationContract = require('./KuwaRegistrationContract');
const KuwaCoin  = require('./KuwaCoin');
const properties= JSON.parse(fs.readFileSync("config_private.json"));
const kuwaCoinABI = JSON.parse(fs.readFileSync('./KuwaCoinABI.json', 'utf-8'));

const dbCon     = mysql.createConnection({
  host: properties["db_host"],
  user: properties["db_user"],
  password: properties["db_password"],
  database: properties["db"]
});
dbCon.connect(function(err) {
  if (err) throw err;
});
var kuwaCoin = null;

app.listen(port, () => console.log(`HTTP ProcessKuwaID API server started and listening on port ${port}.`));
https.createServer(options, app).listen(3021);
console.log('Set HTTPS ProcessKuwaID API server to listen on port 3021.');
createKuwaCoin();

app.get('/processKuwaID', (req, res) => {
  var kuwaID = req.query.kuwaid;
  var workObj = {
    kuwaID: kuwaID,
    status: 'success',
    message: 'Info goes here.',
    credentials: '',
    payee: '',
    res: res,
    actions: {
        paid: 0,
        registered: 'no'
      }
  };

  console.log('\nProcessing Kuwa ID: ' + kuwaID);
  if ( !isAddress(kuwaID) ) {
    workObj.status = 'error';
    workObj.message = 'The Kuwa ID is not valid.';
    console.log('Error: ' + kuwaID + ' is not a valid Kuwa ID.');
    sendAPIErrorResponse(workObj);
  }
  else {
    workObj = getCredentials(kuwaID, workObj);
    if ( workObj.status != 'success' ) {
      sendAPIErrorResponse(workObj);
      return;
    }
    getKuwaIDStatus(workObj);
  }
});

async function createKuwaCoin() {
  dbg('In createKuwaCoin');
  var config = {
    eth_network_url: properties.eth_client.eth_network_url,
    abi: kuwaCoinABI,
    contract_address: properties.kuwa_coin.contract_address,
  }
  kuwaCoin = await new KuwaCoin
    (
      properties.eth_client.eth_network_url,
      kuwaCoinABI,
      properties.kuwa_coin.contract_address,
      setKuwaCoin
    );
}

function setKuwaCoin(kc) {
  dbg('In setKuwaCoin');
  kuwaCoin = kc;
}

function getCredentials( kuwaID, workObj ) {
  dbg('In getCredentials');
  const path = properties['registrations_path'] + kuwaID;
  var message = '';
  if ( !fs.existsSync( path ) ) {
    message = 'Error: The following path does not exist: ' + path;
    console.log(message);
    workObj.status = 'error';
    workObj.message = message;
    return workObj;
  }
  var info = fs.readFileSync(path+'/info.json');
  info = JSON.parse(info);
  var credentials = {
    kuwaID: kuwaID,
    contractAddress: info['ContractAddress'],
    contractABI: info['ContractABI']
  };
  workObj.credentials = credentials;
  return workObj;
}

function getKuwaIDStatus(workObj) {
  dbg('In getKuwaIDStatus');
  var config =
  {
    ethNetworkUrl: properties['eth_client']['eth_network_url'],
    address: workObj['credentials']['contractAddress'],
    abi: workObj['credentials']['contractABI'],
    callBack: processKuwaIDStatus,
    workObj: workObj
  }
  var contract = new KuwaRegistrationContract(config);
}

function processKuwaIDStatus(contract, config) {
  var workObj = config.workObj;
  console.log('Kuwa Registration Status: '+ contract.status);
  if ( contract.status == 'Valid' ) {
    workObj.message = "The status of this ID is valid.";
    workObj.credentials.kuwaIDStatus = 'Valid';
    getKuwaIDBalance(workObj);
  }
  else {
    workObj.message = "The status of this ID is not valid.";
    sendAPIErrorResponse(workObj);
  }
}

function getKuwaIDBalance(workObj) {
  dbg('In getKuwaIDBalance');
  kuwaCoin.getBalance
  ({
    kuwaID: workObj.credentials.kuwaID,
    callBack: processKuwaIDBalance,
    workObj: workObj
  });
}

function processKuwaIDBalance(balance, config) {
  workObj = config.workObj;
  dbg('In processKuwaIDBalance');
  workObj.credentials.kuwaCoinBalance = balance;
  lookupPayee(workObj);
}

function lookupPayee(workObj) {
  dbg('In lookupPayee for Kuwa ID "' +
    workObj.credentials.kuwaID +
      '" and contract adddress "' + workObj.credentials.contractAddress + '."');
  dbCon.query("SELECT * FROM payee WHERE kuwa_id = '" + workObj.credentials.kuwaID + "'", function (err, result, fields) {
    if (err) {
      console.log('A DB error occured in the lookupPayee method. Error Code: ' + err.code);
      workObj.message = 'A DB error occured.';
      sendAPIErrorResponse(workObj);
      return;
    }
    if ( result.length == 0 ) {
      console.log('The Kuwa ID is not registered for a basic income.');
      workObj.payee = null;
      registerPayee(workObj);
    }
    else {
      console.log('The Kuwa ID is registered for a basic income.');
      workObj.message = 'This ID was already registerd for a basic income.';
      sendAPISuccessResponse(workObj);
    }
  });
}

function registerPayee(workObj) {
  dbg('In registerPayee');
  console.log('ID : ' + workObj.credentials.kuwaID);
  let statement = "INSERT INTO payee (kuwa_id, datetime_created) " +
    "VALUES ('" + workObj.credentials.kuwaID + "', NOW())";
  dbCon.query(statement, function (err, result, fields) {
    if (err) {
      console.log('A DB error occured in the registerPayee method. Error Code: ' + err.code);
      workObj.message = 'A DB error occured.';
      sendAPIErrorResponse(workObj);
      return;
    }
    workObj.payee = result[0];
    workObj.actions.registered = 'yes';
    workObj.message = 'The Kuwa ID is now registered for a basic income.';
    if (workObj.credentials.kuwaCoinBalance == 0) {
      sendKuwaCoin(1, workObj);
    }
    else {
      sendAPISuccessResponse(workObj);
    }
  });
}

function sendKuwaCoin(amount, workObj) {
  dbg('In sendKuwaCoin');
  var config = {
    amount: amount,
    contract_address: properties.kuwa_coin.contract_address,
    to: workObj.credentials.kuwaID,
    from: properties.kuwa_coin.wallet_address,
    privateKey: properties.kuwa_coin.wallet_private_key,
    callBack: doPostTransferProcessing,
    workObj: workObj
  }
  kuwaCoin.transfer(config);
}

function doPostTransferProcessing(newBalance, config) {
  dbg('In doPostTransferProcessing');
  workObj = config.workObj;
  if (newBalance > 0) {
    workObj.actions.paid = 1;
    workObj.credentials.kuwaCoinBalance = newBalance;
  }
  sendAPISuccessResponse(workObj);
}

//++++++++ Utility Functions ***************

/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
var isAddress = function (address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        // Otherwise check each case
        return isChecksumAddress(address);
    }
};

function sendAPIErrorResponse(workObj) {
  dbg('In sendAPIErrorResponse');
  const apiResult = {
    status: 'error',
    message: workObj.message
  }
  workObj.res.send(JSON.stringify(apiResult));
}

function sendAPISuccessResponse(workObj) {
  dbg('In sendAPISuccessResponse');
  const apiResult = {
    status: 'success',
    message: workObj.message,
    kuwaID: workObj.credentials.kuwaID,
    kuwaIDStatus: workObj.credentials.kuwaIDStatus,
    contractAddress: workObj.credentials.contractAddress,
    kuwaCoinBalance: workObj.credentials.kuwaCoinBalance,
    actions: workObj.actions
  }
  workObj.res.send(JSON.stringify(apiResult));
}

/**
 * Checks if the given string is a checksummed address
 *
 * @method isChecksumAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
var isChecksumAddress = function (address) {
    // Check each case
    address = address.replace('0x','');
    var addressHash = sha3(address.toLowerCase());
    for (var i = 0; i < 40; i++ ) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
};

function dbg(text) {
  if (debug) console.log(text);
}
