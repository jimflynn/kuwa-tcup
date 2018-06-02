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
var Web3 = require('web3');
//var keythereum = require('keythereum');

if (typeof web3 !== 'undefined')
    web3 = new Web3(web3.currentProvider);
else
    web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/8Dx9RdhjqIl1y3EQzQpl/"));

// listen to simple button click, later in this project we can use form submission event
var btn = document.getElementById("Submit");
btn.addEventListener("click", sponsorService);

function sponsorService() {
    console.log('entering s1');
    var client_key = document.getElementById("client-key").value;
    var sponsor_key = "secret"; // get this from server later on in the project

    if (client_key === sponsor_key) { // note the triple ===, indicates equality for both value as well as type

        var Wallet = require('ethereumjs-wallet');
        var EthUtil = require('ethereumjs-util');
        const privateKeyString = '0x61ce8b95ca5fd6f55cd97ac60817777bdf64f1670e903758ce53efc32c3dffeb';
        const privateKeyBuffer = EthUtil.toBuffer(privateKeyString);
        const wallet = Wallet.fromPrivateKey(privateKeyBuffer);
        const publicKey = wallet.getPublicKeyString();
        console.log(publicKey);
        const address = wallet.getAddressString();
        console.log(address);
        const keystoreFilename = wallet.getV3Filename();
        console.log(keystoreFilename);
        const keystore = wallet.toV3("PASSWORD");
        console.log(keystore);
          
        
    }
    else {
        alert("Your shared secret key did not match. Please try again.");
    }
}

function generateNewKey() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 50; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
