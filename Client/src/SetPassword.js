import React, { Component } from 'react';
import { Button, Container, Row, Col, Form, FormGroup, Label, Input, Badge, Collapse, Card, CardBody } from 'reactstrap';

export default class SetPassword extends Component {
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