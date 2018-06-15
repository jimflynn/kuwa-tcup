import React, { Component } from 'react';
import Web3 from 'web3';
import { Button, Container, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://rinkeby.infura.io/8Dx9RdhjqIl1y3EQzQpl"));

export default class RequestSponsorship extends Component {
    constructor(props) {
      super(props);
      this.toggle = toggle.bind(this);
      this.requestSponsorship = this.requestSponsorship.bind(this);
      this.handleChange = handleChange.bind(this);
      this.togglePassword = togglePassword.bind(this);
      this.state = { 
        collapse: false, 
        password: '',
        inputType: 'password'
      };
      this.dummyRequest = this.dummyRequest.bind(this);
    }
  
    async requestSponsorship() {
      var formData = new FormData();
  
      formData.append('address',this.props.kuwaId);
      formData.append('SS',this.state.password);
      
      let response = await fetch('http://alpha.kuwa.org:3000/sponsorship_requests/', {
       method: 'POST',
       body: formData
      })
      let responseJson = await response.json();
      console.log(responseJson);
      loadWallet(this.props.privateKey);
      let contract = await loadContract(responseJson.abi, responseJson.contractAddress, 4300000, '22000000000', this.props.kuwaId);
      let challenge  = await contract.methods.getChallenge().call();
      this.props.showStepTwo(challenge);
    }
  
    async dummyRequest() {
      let response = {
        address:"0x6FD87c913e22E75b53fA1DB501081134a18aEF96",
        abi:abi
      }
      loadWallet(this.props.privateKey);
      let contract = await loadContract(JSON.parse(response.abi), response.address, 4300000, '22000000000', this.props.kuwaId);
      let challenge  = await contract.methods.getChallenge().call();
      this.props.showStepTwo(challenge);
    }
  
    render() {
      return (
        <Container>
          <Row className="row-kuwa-reg">
            <Col>
              <h3>
                Your private key and Kuwa ID have been created. You are ready to request sponsorship. 
              </h3>
            </Col>
          </Row>
          <Row className="row-kuwa-reg">
            <Col>
              <Form>
                <FormGroup>
                  <Label for="password">Provide Shared Secret to request sponsorship</Label>
                  <Input type={this.state.inputType} placeholder="Shared Secret" value={this.state.password} onChange={this.handleChange} />
                </FormGroup>
                  <FormGroup check>
                  <Label check>
                    <Input type="checkbox" onChange={this.togglePassword} />
                    Show Shared Secret
                  </Label>
                </FormGroup>
                <br/>
                <Button color="primary" onClick={this.requestSponsorship}>Request Sponsorship</Button>
              </Form>
            </Col>        
          </Row>
        </Container>
      );
    }
  }

  var togglePassword = function(){
    var inputType = 'password';
    if (this.state.inputType === 'password') {
      inputType = 'text';
    }
    this.setState({
      inputType: inputType
    });
  }
  
  var handleChange = function(event) {
    this.setState({
      password: event.target.value
    });
  }
  
  var toggle = function() {
    this.setState({ collapse: !this.state.collapse });
  }

  var loadWallet = function(privateKey) {
    web3.eth.accounts.wallet.clear();
    web3.eth.accounts.wallet.add(privateKey);
  }
  
  var loadContract = async function(abi, contractAddress, gas, gasPrice, from) {
    let contract = new web3.eth.Contract(abi);
    contract.options.address = contractAddress;
    contract.options.from = from;
    contract.options.gasPrice = gasPrice;
    contract.options.gas = gas;
    return contract;
  }
  
  var abi = '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"markAsInvalid","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"killContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"standard","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getChallenge","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"withdrawals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"markAsValid","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getRegistrationStatus","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_initialSupply","type":"uint256"},{"name":"_clientAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_challenge","type":"uint256"},{"indexed":false,"name":"_registrationStatus","type":"uint8"}],"name":"ChallengeValue","type":"event"}]';