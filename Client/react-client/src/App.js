import React, { Component } from 'react';
import keythereum from 'keythereum';
import logo from './logo.svg';
import loading from './loading.gif';
import './App.css';
import { Alert, 
  Button, Container, Row, Col, Form, FormGroup, Label, Input, FormText, Badge, Collapse, Card, CardBody } from 'reactstrap';

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
    this.password = '';
    this.kuwaId = '';
    this.privateKey = '';
  }

  generateKeystore() {
    //defining parameters and options to create an ethereum wallet
    var params = { keyBytes: 32, ivBytes: 16 };
    var dk = keythereum.create(params);
    
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
      this.kuwaId = keyObject.address;
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
      this.privateKey = privateKey.toString('hex');
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

  showStepTwo() {
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
          showStepTwo = {this.showStepTwo}
        />
      );
    } else if (this.state.showStepTwo) {
      return (
        <StepTwo 
          ethereumAddress = {this.kuwaId}
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
    if (this.state.password != '') {
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

class Loading extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Row className="row-kuwa-reg">
          <Col>
            <img className="loading-kuwa-reg" src={loading} alt="loading" />
          </Col>
        </Row>
      </Container>
    );
  }
}

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
  }

  requestSponsorship() {
    var formData = new FormData();

    formData.append('address',this.props.kuwaId);
    formData.append('SS',this.state.password);
    
    fetch('http://alpha.kuwa.org:3000/sponsorship_requests/', {
     method: 'POST',
     body: formData
    })
    .then(response => response.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
    
    return false;
    
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
  }

  alerting() {
    alert("Not yet implemented")
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
            <strong>Challenge Phrase: </strong>Soon...
          </Col>
        </Row>
        <Row className="row-kuwa-reg">
          <Col>
            <Form>
              <FormGroup>
                <Label for="videoFile">File</Label>
                <Input type="file" id="videoFile" />
              </FormGroup>
              <Button color="primary" onClick={this.alerting}>Upload Info</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

var togglePassword = function(){
  var inputType = 'password';
  if (this.state.inputType == 'password') {
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

export default CreateKuwaId;
