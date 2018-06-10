/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

// Priyadarshi Rath

// set up Web3
// var Web3 = require('web3');
// //var keythereum = require('keythereum');

// if (typeof web3 !== 'undefined')
//     web3 = new Web3(web3.currentProvider);
// else
//     web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/8Dx9RdhjqIl1y3EQzQpl/"));

// listen to simple button click, later in this project we can use form submission event
var btn = document.getElementById("Submit");
btn.addEventListener("click", onClickActions);

function onClickActions(){


    //result = validateSecretKey();
    
    client_wallet_address = generateKeyPair();

    storeRegistration = storeRegistrationRequest();

    

    //sponsorService();


}

//function to call the REST API to validate the secret key entered by the user with the secret key on the server
function validateSecretKey(){

    var secret_key = document.getElementById("client-key").value;
    var xhttp = new XMLHttpRequest();
    //calling the REST service to store the registration request
    xhttp.open("POST", "http://127.0.0.1:5000/ValidateSecretKeyService", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    var data = JSON.stringify({"secret_key": secret_key});

    var reply = xhttp.send(data);
    console.log(reply);



}

//function to validate the secret key and if valid, then generate a new wallet for the user
function generateKeyPair() {
    console.log('generating key pair');
    var client_key = document.getElementById("client-key").value;
    var sponsor_key = "secret"; // get this from server later on in the project

    if (client_key === sponsor_key) { // note the triple ===, indicates equality for both value as well as type
        
        //defining parameters and options to create the ethereum wallet
        var params = { keyBytes: 32, ivBytes: 16 };
        var dk = keythereum.create(params);
        
        var password = "password" // user input option to give password needs to be implemented?
        var kdf = "pbkdf2"; // or "scrypt" to use the scrypt kdf
        
        var options = {
          kdf: "pbkdf2",
          cipher: "aes-128-ctr",
          kdfparams: {
            c: 262144,
            dklen: 32,
            prf: "hmac-sha256"
          }
        };


        var keyObject = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options); //keyObject is generated using a combination of the password and private key. To get the private key of the newly created keyObject, one needs to have the password parameter passed into the function as well

        var address = keyObject.address;
        var privateKey = keythereum.recover(password, keyObject);

        //the recovered private key will be in buffer and needs to be converted to Hex for readability
        var readablePrivateKey = privateKey.toString('hex');
        var addr2 = keythereum.privateKeyToAddress(privateKey)

        console.log('Address: ' + address);
        console.log('Private key(hex) ' + readablePrivateKey);
        console.log('addr2: ' + addr2);


        var Wallet = require('ethereumjs-wallet');
        var EthUtil = require('ethereumjs-util');

        const wallet = Wallet.fromPrivateKey(privateKey);
        var publicKey = wallet.getPublicKeyString();
        console.log('Public key: ' + publicKey);

        document.getElementById("public-key").innerHTML  = "Your public key is :<br>" + publicKey;

        var private_key_output = "Your private key is :<br>" + readablePrivateKey + "<br> Make a note of this key and please do NOT share the private key with anyone.";
        document.getElementById("private-key").innerHTML = private_key_output;

        return address; 
        
    }
    else {
        alert("Your shared secret key did not match. Please try again.");
    }
}

//function to call the registrationrequest service on the server to store the new registration and create dir
function storeRegistrationRequest(client_wallet_address) {

    var xhttp = new XMLHttpRequest();
    //calling the REST service to store the registration request
    xhttp.open("POST", "http://dev.kuwa.org:8080/StoreRegistrationRequest_war/rest/files/upload", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    var data = JSON.stringify({"wallet_address": client_wallet_address});

    var reply = xhttp.send(data);
    console.log(reply);

}


var randomString = function(length) {
            var text = "0x";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for(var i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }


