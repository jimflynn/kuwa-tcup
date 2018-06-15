import React, { Component } from 'react';
import keythereum from 'keythereum';
import Web3 from 'web3';
import Loading from './Load';
import './App.css';
import { Button, Container, Row, Col, Form, FormGroup, Label, Input, Badge, Collapse, Card, CardBody } from 'reactstrap';

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://rinkeby.infura.io/8Dx9RdhjqIl1y3EQzQpl"));

class CreateKuwaId extends Component {
  constructor(props) {
    super(props);
    this.createKeys = this.createKeys.bind(this);
    this.generateKeystore = this.generateKeystore.bind(this);
    this.processKeystore = this.processKeystore.bind(this);
    this.showRegistrationRequest = this.showRegistrationRequest.bind(this);
    this.showStepTwo = this.showStepTwo.bind(this);
    this.state = {
      showStepOne: true,
      showLoading: false,
      showRequestSponsorship: false,
      showStepTwo: false
    }
  }

  generateKeystore() {
    //defining parameters and options to create an ethereum wallet
    var params = { keyBytes: 32, ivBytes: 16 };
    var dk = keythereum.create(params);
    
    var kdf = "pbkdf2"; // or "scrypt" to use the scrypt kdf
    
    var options = {
      kdf: kdf,
      cipher: "aes-128-ctr",
      kdfparams: {
        c: 262144,
        dklen: 32,
        prf: "hmac-sha256"
      }
    };
    //The key object is generated using a combination of the password and private key. 
    keythereum.dump(this.password, dk.privateKey, dk.salt, dk.iv, options, this.processKeystore); 
  }

  processKeystore(keyObject) {
    if ( !keyObject ) {
      this.setState({
        showLoading: false
      });
      alert("An error occurred when generating keys.");
    } else {      
      this.kuwaId = '0x' + keyObject.address;
      keythereum.recover(this.password, keyObject, this.showRegistrationRequest);
    }
  }

  showRegistrationRequest(privateKey) {
    if ( !privateKey ) {
      this.setState({
        showLoading: false
      });
      alert("An error occurred when recovering private key.");
    } else {
      //TODO: Call Sponsor to get (1) a challenge phrase; (2) a KuwaRegistion contract's address; and (2) the contract's ABI.
      //TODO: Record a video of the registrant speaking the challenge phrase.	
      //The recovered private key will be in buffer and must be converted to Hex for readability.
      this.privateKey = '0x' + privateKey.toString('hex');
      this.setState({
        showLoading: false,
        showRequestSponsorship: true
      });
    }
  }

  createKeys(password) {
    this.setState({
      showStepOne: false,
      showLoading: true
    });
    this.password = password;
    this.generateKeystore();
  }

  showStepTwo(challenge) {
    this.challenge = challenge;
    this.setState({
      showRequestSponsorship: false,
      showStepTwo: true
    });
  }

  render() {
    if (this.state.showStepOne) {
      return (
        <StepOne 
          createKeys = {password => this.createKeys(password)}
        />
      );
    } else if (this.state.showLoading) {
      return (
        <Loading />
      );
    } else if (this.state.showRequestSponsorship) {
      return (
        <RequestSponsorship 
          kuwaId = {this.kuwaId}
          privateKey = {this.privateKey}
          showStepTwo = {challenge => this.showStepTwo(challenge)}
        />
      );
    } else if (this.state.showStepTwo) {
      return (
        <StepTwo 
          ethereumAddress = {this.kuwaId}
          challenge = {this.challenge}
        />
      );
    }
  }
}

class StepOne extends Component {
  constructor(props) {
    super(props);
    this.toggle = toggle.bind(this);
    this.state = { 
      collapse: false,
      show: true,
      password: '',
      inputType: 'password' 
    };
    this.handleChange = handleChange.bind(this);
    this.createKeys = this.createKeys.bind(this);
    this.passwordIsValid = this.passwordIsValid.bind(this);
    this.togglePassword = togglePassword.bind(this);
  }

  createKeys() {
    if (this.passwordIsValid()) {
      this.props.createKeys(this.state.password);
    } else {
      alert('Please specify a password to protect your private key.');
    }
  }

  // Some more conditions may be added in the future
  passwordIsValid() {
    if (this.state.password !== '') {
      return true;
    }
    return false;
  }

  render() {
    return (
      <Container>
        <Row className="row-kuwa-reg">
          <Col>
            <h2>
              <span className="header-kuwa-reg">Create your Kuwa Identity</span>
              <Button color="primary" onClick={this.toggle} outline>
                <Badge color="primary">?</Badge>
              </Button>
            </h2>
          </Col>
        </Row>
        <Row className="row-kuwa-reg">
          <Col>
            <Collapse isOpen={this.state.collapse}>
              <Card className="elem-kuwa-reg">
                <CardBody>
                  Some explanation of what the Kuwa ID is and probably why you are creating a key pair.
                </CardBody>
              </Card>
            </Collapse>
          </Col>
        </Row>
        <Row className="row-kuwa-reg">
          <Col>
            <strong>IMPORTANT:</strong> Keep your private key and password secret. <strong>Remember your password.</strong>
          </Col>
        </Row>
        <Row className="row-kuwa-reg">
          <Col>
            <Form>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input type={this.state.inputType} name="password" id="password" placeholder="Kuwa password" value={this.state.password} onChange={this.handleChange} />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="checkbox" onChange={this.togglePassword} />
                Show Password
              </Label>
            </FormGroup>
            <br/>
            <Button color="primary" onClick={this.createKeys}>Create Keys</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

// class Loading extends Component {
//   render() {
//     return (
//       <Container>
//         <Row className="row-kuwa-reg">
//           <Col>
//             <img className="loading-kuwa-reg" src={loading} alt="loading" />
//           </Col>
//         </Row>
//       </Container>
//     );
//   }
// }

class RequestSponsorship extends Component {
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

class StepTwo extends Component {
  constructor(props) {
    super(props);
    this.toggle = toggle.bind(this);
    this.state = {
      collapse: false
    }
    this.alerting = this.alerting.bind(this);
    this.requestSponsorship = this.requestSponsorship.bind(this);
  }

  alerting() {
    alert("Not yet implemented")
  }

  async requestSponsorship() {
    var formData = new FormData();

    var fileField = document.querySelector("input[type='file']");

    formData.append('ClientAddress',this.props.ethereumAddress);
    formData.append('ChallengeVideo',fileField.files[0]);
    formData.append('ContractABI',"this.props.kuwaId");
    formData.append('ContractAddress',"this.state.password");
    
    let response = await fetch('http://alpha.kuwa.org:3002/KuwaRegistration/', {
     method: 'POST',
     body: formData
    })
    console.log(response);
    return false;
  }

  render() {
    return(
      <Container>
        <Row className="row-kuwa-reg">
          <Col>
            <h2>
              <span className="header-kuwa-reg">Submit Your Kuwa ID Request</span>
              <Button color="primary" onClick={this.toggle} outline>
                <Badge color="primary">?</Badge>
              </Button>
            </h2>
          </Col>
        </Row>
        <Row className="row-kuwa-reg">
          <Col>
            <Collapse isOpen={this.state.collapse}>
              <Card className="elem-kuwa-reg">
                <CardBody>
                  Some explanation.
                </CardBody>
              </Card>
            </Collapse>
          </Col>
        </Row>
        <Row className="row-kuwa-reg">
          <Col>
            <strong>Ethereum Address: </strong>{this.props.ethereumAddress}
          </Col>
        </Row>
        <Row className="row-kuwa-reg">
          <Col>
            <strong>Challenge Phrase: </strong>{this.props.challenge === 0 ? "Challenge expired" : this.props.challenge}
          </Col>
        </Row>
        <Row className="row-kuwa-reg">
          <Col>
            <Form>
              <FormGroup>
                <Label for="videoFile">File</Label>
                <Input type="file" id="videoFile" />
              </FormGroup>
              <Button color="primary" onClick={this.requestSponsorship}>Upload Info</Button>
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

export default CreateKuwaId;
