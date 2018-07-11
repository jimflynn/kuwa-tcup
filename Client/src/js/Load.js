import React from 'react';
import loading from '../img/loading.gif';
import { Container, Row, Col } from 'reactstrap';

/**
 * Shows loading Gif component
 * @export
 * @class Loading
 * @extends Component
 */
export const Loading = (props) => {
  return (
    <Container>
      <Row className="row-kuwa-reg">
        <Col>
          <img className="loading-kuwa-reg" src={loading} alt="loading" />
        </Col>
      </Row>
      <Row className="row-kuwa-reg">
        <Col>
          <h4>{props.loadingMessage}</h4>
        </Col>
      </Row>
    </Container>
  );
}