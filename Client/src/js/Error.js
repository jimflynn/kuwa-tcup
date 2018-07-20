import React from 'react';
import error from '../img/error.png';
import { Container, Row, Col } from 'reactstrap';

/**
 * Shows loading Gif component
 * @export
 * @class Loading
 * @extends Component
 */
export const Error = (props) => {
  return (
    <Container>
        <Row className="row-kuwa-reg">
            <Col>
                <h4>{props.errorMessage}</h4>
            </Col>
        </Row>
        <Row className="row-kuwa-reg">
            <Col>
                <img className="responsive-kuwa-img" src={error} alt="error" />
            </Col>
        </Row>
    </Container>
  );
}