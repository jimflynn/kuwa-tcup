import { Button, Container, Row, Col, Form, FormGroup, Label, Input, Badge, Collapse, Card, CardBody } from 'reactstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class QRCode extends Component {
    render() {
        return (
            <Container>
                {showQRCode(this.props)}
            </Container>
        )
    }
}

const showQRCode = (props) => {
    if (props.qrCodeSrc) {
        return (
            <div>
                <Row className="row-kuwa-reg">
                    <Col>
                        <h2>
                            <span className="header-kuwa-reg">This is your Kuwa Identity</span>
                        </h2>
                    </Col>
                </Row>
                <Row className="row-kuwa-reg">
                    <Col>
                        <img className="responsive-kuwa-img" src={props.qrCodeSrc} alt="QRCode"/>
                    </Col>
                </Row>
            </div>
        );
    }
    return (
        <Row className="row-kuwa-reg">
            <Col>
                <h2>
                    <span className="header-kuwa-reg">You first need to create your Kuwa Identity</span>
                </h2>
            </Col>
        </Row>
    );
}

const mapStateToProps = state => {
    return {
        qrCodeSrc: state.kuwaReducer.kuwaId.qrCodeSrc
    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QRCode);