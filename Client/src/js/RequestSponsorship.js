import React, { Component } from 'react';
import { Button, Container, Row, Col, Form, FormGroup, Label, Input, Badge, Collapse, Card, CardBody } from 'reactstrap';

import { Loading } from './Load';

import { toggleCollapse, togglePasswordVisibility } from './actions/screenActions';
import { requestSponsorship } from './actions/kuwaActions';
import { connect } from 'react-redux';

let sharedSecret;

/**
 * Shows component in charge of requesing sponsorship to the sponsor
 * @export
 * @class RequestSponsorship
 * @extends Component
 */
class RequestSponsorship extends Component {
    render() {
      if (this.props.loading) {
        return (
          <Loading loadingMessage={this.props.loadingMessage} />
        );
      }
      return (
        <div>
          {renderRequestSponsorship(this.props)}
        </div>
      )
    }
  }

const renderRequestSponsorship = props => {
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
                The Shared Secret is obtained from your Sponsor.
              </CardBody>
            </Card>
          </Collapse>
        </Col>
      </Row>

      <Row className="row-kuwa-reg">
        <Col>
          <Form>
            <FormGroup>
              <Label for="password">Provide Shared Secret to request sponsorship</Label>
              <Input type={props.showPassword ? "text" : "password"} placeholder="Shared Secret" onChange={event => {sharedSecret = event.target.value}} />
            </FormGroup>
              <FormGroup check>
              <Label check>
                <Input type="checkbox" onChange={props.togglePasswordVisibility} />
                Show Shared Secret
              </Label>
            </FormGroup>
            <br/>
            <Button color="primary" onClick={() => props.requestSponsorship(props.keyObject, props.privateKey, sharedSecret)}>Request Sponsorship</Button>
          </Form>
        </Col>        
      </Row>
    </Container>
  )
}

const mapStateToProps = state => {
  let currentKuwaId = state.kuwaReducer.currentKuwaId;
  return {
    showPassword: state.screenReducer.requestSponsorship.showPassword,
    keyObject: state.kuwaReducer.kuwaIds[currentKuwaId].keyObject,
    privateKey: state.kuwaReducer.kuwaIds[currentKuwaId].privateKey,
    collapsed: state.screenReducer.requestSponsorship.collapsed,
    loading: state.kuwaReducer.screen.requestSponsorship.loading,
    loadingMessage: state.kuwaReducer.screen.loading.helpText
  }
}

const mapDispatchToProps = dispatch => {
  return {
    requestSponsorship: (keyObject, privateKey, sharedSecret) => {
      dispatch(requestSponsorship(keyObject, privateKey, sharedSecret))
    },
    toggleCollapse: () => {
      dispatch(toggleCollapse("requestSponsorship"))
    },
    togglePasswordVisibility: () => {
      dispatch(togglePasswordVisibility("requestSponsorship"))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestSponsorship);