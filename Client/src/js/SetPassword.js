import React, { Component } from 'react';
import { Button, Container, Row, Col, Form, FormGroup, Label, Input, Badge, Collapse, Card, CardBody } from 'reactstrap';

import { toggleCollapse, togglePasswordVisibility } from './actions/screenActions';
import { createKeys } from './actions/kuwaActions';
import { connect } from 'react-redux';

/**
 * Shows component to create password for the keypair generated
 * @export
 * @class SetPassword
 * @extends Component
 */
class SetPassword extends Component {
  render() {
    return (
      <Container>
        <Row className="row-kuwa-reg">
          <Col>
            <h2>
              <span className="header-kuwa-reg">Create your Kuwa Identity</span>
              <Button color="primary" onClick={this.props.toggleCollapse} outline>
                <Badge color="primary">?</Badge>
              </Button>
            </h2>
          </Col>
        </Row>
        <Row className="row-kuwa-reg">
          <Col>
            <Collapse isOpen={!this.props.collapsed}>
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
              <Label for="identifier">Identifier</Label>
              <Input type="text" name="identifier" id="identifier" placeholder="Kuwa Identifier" onChange={event => {this.identifier = event.target.value}} />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input type={this.props.showPassword ? "text" : "password"} name="password" id="password" placeholder="Kuwa password" onChange={event => {this.password = event.target.value}} />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="checkbox" onChange={this.props.togglePasswordVisibility} />
                Show Password
              </Label>
            </FormGroup>
            <br/>
            <Button color="primary" onClick={() => this.props.createKeys(this.identifier, this.password)}>Create Keys</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    showPassword: state.screenReducer.setPassword.showPassword,
    collapsed: state.screenReducer.setPassword.collapsed,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createKeys: (identifier, password) => {
      dispatch(createKeys(identifier, password))
    },
    toggleCollapse: () => {
      dispatch(toggleCollapse("setPassword"))
    },
    togglePasswordVisibility: () => {
      dispatch(togglePasswordVisibility("setPassword"))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetPassword);