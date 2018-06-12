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
  }

  render() {
    return <StepOne />;
  }
}

class StepOne extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { 
      collapse: false,
      show: true 
    };
  }

  toggle() {
    this.setState({ 
      collapse: !this.state.collapse,
      show: this.state.show
    });
  }

  render() {
    return (
      <Container>
        <Row className="row-kuwa-reg">
          <Col>
            <h2>
              <span class="header-kuwa-reg">Create your Kuwa Identity</span>
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
              <Input type="password" name="password" id="password" placeholder="Kuwa password" />
            </FormGroup>
            <Button color="primary" onClick={this.onClick}>Create Keys</Button>
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
    this.state = {
      show: true
    };
  }

  render() {
    return (
      <div>
        {this.state.show ? <img src={loading} alt="loading" /> : null};
      </div>
    );
  }
}

class PrivateKey extends Component {

}

export default CreateKuwaId;
