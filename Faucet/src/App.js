/**This is the Kuwa Faucet React application. 
Author - Hrishikesh Kashyap, Last Updated - 06/22/2018
*/

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const Web3 = require('web3');
let web3 = new Web3();

//setting the provider to the local testrpc network
web3.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'));
web3.eth.defaultAccount = web3.eth.accounts[0];

class App extends Component {
  
  constructor (props) {
    super (props);
    const MyContract = window.web3.eth.contract([
  {
    "constant": true,
    "inputs": [],
    "name": "key3",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "key2",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "key1",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getValidKuwaID",
    "outputs": [
      {
        "name": "",
        "type": "string"
      },
      {
        "name": "",
        "type": "string"
      },
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]);

    this.state = {
      ContractInstance: MyContract.at ('0xc3d75507e3c7f94e3bbbefd8254b175d30ba090d')
    }

    this.getValidKuwaID = this.getValidKuwaID.bind (this);

  }

  
  getValidKuwaID () {
    const { getID } = this.state.ContractInstance;

    getID ((err, secret) => {
      if (err) console.error ('An error occured::::', err);
      console.log ('Valid Kuwa IDs', secret);
    })
  }



  render () {
    return (
      <div className='App'>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title"> Kuwa Faucet </h1>
        </header>

        
        <br />
        <br />
        <button onClick={ this.getValidKuwaID }> Get valid Kuwa IDs </button>
        <br />
        <br />
        
      </div>
    );
  }
}

export default App;
