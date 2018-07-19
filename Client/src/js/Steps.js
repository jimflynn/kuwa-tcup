import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Button } from 'mdbreact';
import kuwaIcon from '../img/kuwa-icon.png';

class Steps extends Component {
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
                            <span>Create your Kuwa ID</span>
                        </div>
                    </Col>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl={xlSide}></Col>
                </Row>
                <Row>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl="3"></Col>
                    <Col xs={xsCenter} sm={smCenter} md={mdCenter} lg={lgCenter} xl={xlCenter}>
                        <div className="text-center">
                            <span>Step 1 – Provide credentials.</span>
                        </div>
                    </Col>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl={xlSide}></Col>
                </Row>
                <Row>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl="3"></Col>
                    <Col xs={xsCenter} sm={smCenter} md={mdCenter} lg={lgCenter} xl={xlCenter}>
                        <div className="text-center">
                            <span>Step 2 – Record a registration video.</span>
                        </div>
                    </Col>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl={xlSide}></Col>
                </Row>
                <Row>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl="3"></Col>
                    <Col xs={xsCenter} sm={smCenter} md={mdCenter} lg={lgCenter} xl={xlCenter}>
                        <div className="text-center">
                            <span>Step 3 – Connect your ID to other IDs.</span>
                        </div>
                    </Col>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl={xlSide}></Col>
                </Row>
                <Row>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl="3"></Col>
                    <Col xs={xsCenter} sm={smCenter} md={mdCenter} lg={lgCenter} xl={xlCenter}>
                        <div className="text-center">
                            <span>After the Kuwa network validates your ID, you can use your Kuwa ID to access Kuwa-compatible services, such as basic income distributions, financial services, voting, etc.</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(Steps);