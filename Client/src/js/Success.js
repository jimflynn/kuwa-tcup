import React from 'react';
import success from '../img/success.png';
import { Container, Row, Col } from 'reactstrap';

/**
 * Shows loading Gif component
 * @export
 * @class Loading
 * @extends Component
 */
export const Success = (props) => {
  return (
    <Container>
        <Row className="row-kuwa-reg">
            <Col>
                <h4>{props.successMessage}</h4>
            </Col>
        </Row>
        <Row className="row-kuwa-reg">
            <Col>
                <img className="responsive-kuwa-img" src={success} alt="success" />
            </Col>
        </Row>
    </Container>
  );
}