import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Button } from 'mdbreact';
import kuwaIcon from '../img/kuwa-icon.png';

class YourKuwaId extends Component {
    render() {
        const xsSide = "0", smSide = "1", mdSide = "2", lgSide = "3", xlSide = "3";
        const xsCenter = "12", smCenter = "10", mdCenter = "8", lgCenter = "6", xlCenter = "6";
        return (
            <Container>
                <Row>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl="3"></Col>
                    <Col xs={xsCenter} sm={smCenter} md={mdCenter} lg={lgCenter} xl={xlCenter}>
                        <div className="text-center">
                            <img src={ kuwaIcon } alt="Kuwa Icon" />
                            <span>Your Kuwa ID</span>
                        </div>
                    </Col>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl={xlSide}></Col>
                </Row>
                <Row>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl="3"></Col>
                    <Col xs={xsCenter} sm={smCenter} md={mdCenter} lg={lgCenter} xl={xlCenter}>
                        <div className="text-center">
                            <span>KuwaID:</span>
                            <br />
                            <span>0x999999999999999999999</span>
                        </div>
                    </Col>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl={xlSide}></Col>
                </Row>
                <Row>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl="3"></Col>
                    <Col xs={xsCenter} sm={smCenter} md={mdCenter} lg={lgCenter} xl={xlCenter}>
                        <div className="text-center">
                            <span>The following QR code image represents your Kuwa ID:</span>
                            <br />
                            <img src={ kuwaIcon } alt="Kuwa Icon" />
                        </div>
                    </Col>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl={xlSide}></Col>
                </Row>
                <Row>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl="3"></Col>
                    <Col xs={xsCenter} sm={smCenter} md={mdCenter} lg={lgCenter} xl={xlCenter}>
                        <div className="text-center">
                            <span>Step 3 - Please ask other people that you know to scan your QR code.</span>
                        </div>
                    </Col>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl={xlSide}></Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(YourKuwaId);