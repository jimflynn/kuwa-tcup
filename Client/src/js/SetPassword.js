import React, { Component } from 'react';
import { Button, Container, Row, Col, Form, FormGroup, Label, Input, Badge, Collapse, Card, CardBody } from 'reactstrap';

import { Loading } from './Load'

import { toggleCollapse, togglePasswordVisibility } from './actions/screenActions';
import { createKeys } from './actions/kuwaActions';
import { connect } from 'react-redux';

let password;

/**
 * Shows component to create password for the keypair generated
 * @export
 * @class SetPassword
 * @extends Component
 */
class SetPassword extends Component {
  render() {
    if(this.props.loading) {
      return (
        <Loading loadingMessage={this.props.loadingMessage} />
      )
    }
    return (
      <div>
        {renderSetPassword(this.props)}
      </div>
    )
  }
}

const renderSetPassword = (props) => {
  return (
    <Container>
      <Row className="row-kuwa-reg">
        <Col>
          <h2>
            <span className="header-kuwa-reg">Create your Kuwa Identity</span>
            <Button color="primary" onClick={props.toggleCollapse} outline>
              <Badge color="primary">?</Badge>
            </Button>
          </h2>
        </Col>
      </Row>
      <Row className="row-kuwa-reg">
        <Col>
          <Collapse isOpen={!props.collapsed}>
            <Card className="elem-kuwa-reg">
              <CardBody>
                Here you will create your unique Kuwa ID that identifies who you are and allows you to be sponsored. It is VERY important that you remember your password. If you forget it, there is not way to recover it. Keep your password in a SAFE place. 
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
            <Input type={props.showPassword ? "text" : "password"} name="password" id="password" placeholder="Kuwa password" onChange={event => {password = event.target.value}} />
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" onChange={props.togglePasswordVisibility} />
              Show Password
            </Label>
          </FormGroup>
          <br/>
          <Button color="primary" onClick={() => props.createKeys(password)}>Create Keys</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

const mapStateToProps = state => {
  return {
    showPassword: state.screenReducer.setPassword.showPassword,
    collapsed: state.screenReducer.setPassword.collapsed,
    loading: state.kuwaReducer.screen.setPassword.loading,
    loadingMessage: state.kuwaReducer.screen.loading.helpText
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createKeys: password => {
      dispatch(createKeys(password))
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