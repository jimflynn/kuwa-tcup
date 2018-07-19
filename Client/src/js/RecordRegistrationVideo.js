import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Button } from 'mdbreact';
import kuwaIcon from '../img/kuwa-icon.png';

class RecordRegistrationVideo extends Component {
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
                            <span>Step 2 – Record your registration video.</span>
                        </div>
                    </Col>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl={xlSide}></Col>
                </Row>
                <Row>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl="3"></Col>
                    <Col xs={xsCenter} sm={smCenter} md={mdCenter} lg={lgCenter} xl={xlCenter}>
                        <div className="text-center">
                            <span>Every living human is entitled to exactly one Kuwa ID. To help us identify you, we need a video of you speaking the following numbers:</span>
                        </div>
                    </Col>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl={xlSide}></Col>
                </Row>
                <Row>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl="3"></Col>
                    <Col xs={xsCenter} sm={smCenter} md={mdCenter} lg={lgCenter} xl={xlCenter}>
                        <div className="text-center">
                        <span>4312</span>
                        </div>
                    </Col>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl={xlSide}></Col>
                </Row>
                <Row>
                    <Col xs={xsSide} sm={smSide} md={mdSide} lg={lgSide} xl="3"></Col>
                    <Col xs={xsCenter} sm={smCenter} md={mdCenter} lg={lgCenter} xl={xlCenter}>
                        <div className="text-center">
                            <Button>Record Video</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(RecordRegistrationVideo);