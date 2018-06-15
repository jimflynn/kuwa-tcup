import React, { Component } from 'react';
import loading from './loading.gif';
import { Container, Row, Col } from 'reactstrap';

class Loading extends Component {
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

export default Loading;
