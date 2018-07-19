import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Button, Input } from 'mdbreact';
import kuwaIcon from '../img/kuwa-icon.png';

class ProvideCredentials extends Component {
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
                            <span>Step 1 – Provide credentials.</span>
                        </div>
                    </Col>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl={xlSide}></Col>
                </Row>
                <Row>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl="3"></Col>
                    <Col xs={xsCenter} sm={smCenter} md={mdCenter} lg={lgCenter} xl={xlCenter}>
                        <div className="text-center">
                            <span>Kuwa registrations must have a sponsor. The Kuwa Foundation is the sponsor of your Kuwa registration. For credentials, we only require that you enter a passcode. If you do not have a passcode, please go to http://kuwa.org to request one.</span>
                        </div>
                    </Col>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl={xlSide}></Col>
                </Row>
                <Row>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl="3"></Col>
                    <Col xs={xsCenter} sm={smCenter} md={mdCenter} lg={lgCenter} xl={xlCenter}>
                        <div className="text-center">
                            <Input label="Enter the passcode we emailed you" />
                        </div>
                    </Col>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl={xlSide}></Col>
                </Row>
                <Row>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl="3"></Col>
                    <Col xs={xsCenter} sm={smCenter} md={mdCenter} lg={lgCenter} xl={xlCenter}>
                        <div className="text-center">
                            <Input label="Choose a Kuwa password" />
                        </div>
                    </Col>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl={xlSide}></Col>
                </Row>
                <Row>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl="3"></Col>
                    <Col xs={xsCenter} sm={smCenter} md={mdCenter} lg={lgCenter} xl={xlCenter}>
                        <div className="text-center">
                            <Button>Continue</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProvideCredentials);