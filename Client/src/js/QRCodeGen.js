import { Button, Container, Row, Col, Form, FormGroup, Label, Input, Badge, Collapse, Card, CardBody } from 'reactstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Instascan from 'instascan';

import { startScanner, qrCodeFound } from './actions/qrActions';

class QRCode extends Component {
    componentDidMount() {
        if(!this.props.isMobile) {
            this.scanner = new Instascan.Scanner({ video: document.getElementById('qrScanner') });
            let foundQrCode = (function(kuwaId) {
                qrCodeFound(kuwaId, this.scanner)
            }).bind(this);
            this.scanner.addListener('scan', foundQrCode);
        }
    }
    render() {
        console.log("Scanner", this.scanner)
        return (
            <Container>
                {showQRCode(this.props)}
                {scanQRCode(this.props, this.scanner)}
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

const scanQRCode = (props, scanner) => {
    if(props.isMobile) {
        return null;
    } else {
        return (
            <div>
                <Button color="primary" onClick={() => props.startScanner(scanner)}>Start Scan</Button>
                <video id="qrScanner" />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        qrCodeSrc: state.kuwaReducer.kuwaId.qrCodeSrc,
        isMobile: state.kuwaReducer.isMobile
    }
}

const mapDispatchToProps = dispatch => {
    return {
        startScanner: scanner => {
            dispatch(startScanner(scanner))
        },
        qrCodeFound: (kuwaId, scanner) => {
            dispatch(qrCodeFound(kuwaId, scanner))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QRCode);