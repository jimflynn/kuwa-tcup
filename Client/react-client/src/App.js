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
    this.state = {
      showStepOne: true,
      showLoading: false,
      showPrivateKey: false,
      showStepTwo: false
    }
    this.password = '';
    this.keyObjectAddress = '';
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
        showStepOne: false,
        showLoading: false,
        showPrivateKey: false,
        showStepTwo: false
      });
      alert("An error occurred when generating keys.");
    } else {      
      this.keyObjectAddress = keyObject.address;
      keythereum.recover(this.password, keyObject, this.showRegistrationRequest);
    }
  }

  showRegistrationRequest(privateKey) {
    if ( !privateKey ) {
      this.setState({
        showStepOne: false,
        showLoading: false,
        showPrivateKey: false,
        showStepTwo: false
      });
      alert("An error occurred when recovering private key.");
    } else {
      //TODO: Call Sponsor to get (1) a challenge phrase; (2) a KuwaRegistion contract's address; and (2) the contract's ABI.
      //TODO: Record a video of the registrant speaking the challenge phrase.	
      //The recovered private key will be in buffer and must be converted to Hex for readability.
      this.privateKey = privateKey.toString('hex');
      this.setState({
        showStepOne: false,
        showLoading: false,
        showPrivateKey: true,
        showStepTwo: false
      });
    }
  }

  createKeys(password) {
    this.setState({
      showStepOne: false,
      showLoading: true,
      showPrivateKey: false,
      showStepTwo: false
    });
    this.password = password;
    this.generateKeystore();
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
    } else if (this.state.showPrivateKey) {
      return (
        <PrivateKey 
          privateKey = {this.privateKey}
        />
      );
    }
  }
}

class StepOne extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { 
      collapse: false,
      show: true,
      password: '',
      inputType: 'password' 
    };
    this.handleChange = this.handleChange.bind(this);
    this.createKeys = this.createKeys.bind(this);
    this.passwordIsValid = this.passwordIsValid.bind(this);
    this.togglePassword = this.togglePassword.bind(this);
  }

  toggle() {
    this.setState({ 
      collapse: !this.state.collapse,
      show: this.state.show,
      password: this.state.password,
      inputType: this.state.inputType
    });
  }

  handleChange(event) {
    this.setState({
      collapse: this.state.collapse,
      show: this.state.show,
      password: event.target.value,
      inputType: this.state.inputType
    });
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

  togglePassword(){
    var inputType = 'password';
    if (this.state.inputType == 'password') {
      inputType = 'text';
    }
    this.setState({
      collapse: this.state.collapse,
      show: this.state.show,
      password: this.state.password,
      inputType: inputType
    });
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

class PrivateKey extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <Container>
        <Row className="row-kuwa-reg">
          <Col>
            <h2>
              Your private key: 
            </h2>
          </Col>
        </Row>
        <Row className="row-kuwa-reg">
          <Col>
           <span className="private-key">{this.props.privateKey}</span>
          </Col>
        </Row>
        <Row className="row-kuwa-reg">
          <Col>
            <strong>IMPORTANT:</strong> Keep your private key and password secret. Remember your password.
          </Col>
        </Row>
        <Row className="row-kuwa-reg">
          <Col>
            <Button color="primary" onClick={this.props.showStepTwo}>Continue</Button>
          </Col>        
        </Row>
      </Container>
    );
  }
}

class StepTwo extends Component {

}

export default CreateKuwaId;
