import React, { Component } from 'react';
import loading from '../img/loading.gif';
import { Container, Row, Col } from 'reactstrap';

/**
 * Shows loading Gif component
 * @export
 * @class Loading
 * @extends Component
 */
export default class Loading extends Component {
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