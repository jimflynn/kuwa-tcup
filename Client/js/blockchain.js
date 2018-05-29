// Priyadarshi Rath

// Interacts with the ethereum blockchain and retrieves the most recent block.
// The purpose of writing this is imply to verify that web3.js is working properly.

var Web3 = require('web3');

if (typeof web3 !== 'undefined')
  web3 = new Web3(web3.currentProvider);
else
  // set the provider you want, currently using the free Infura service to verify correctness of web3
  // use your own Infura key from https://infura.io/
  web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/MY_INFURA_KEY/"));

// extract latest block information to verify that web3 is working as expected
latest_block = web3.eth.getBlock("latest");

answer = "";

for(var key in latest_block) {
    if (latest_block.hasOwnProperty(key)) {
        value = latest_block[key];
        if (value.constructor === Array) {
            answer = answer + key + " :<br>";
            for (var idx = 0; idx < value.length; idx++) {
                console.log(value[idx] + ',');
                answer = answer + value[idx] + ",<br>";
            }
            answer = answer + "<br><br>";
        }
        else {
            answer = answer + key + " : " + latest_block[key] + "<br><br>";
        }
    }
}

document.getElementById("latest_block_info").innerHTML = answer;
