import React, { Component } from 'react';
import { Button, Container, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';

export default class Video extends Component {
    constructor(props) {
        super(props);
        this.takeVideo = this.takeVideo.bind(this);
        this.captureError = this.captureError.bind(this);
        this.captureSuccess = this.captureSuccess.bind(this);
        this.renderVideo = this.renderVideo.bind(this);
        this.state = {
            videoStatus: 'waiting'
        }
    }

    takeVideo() {
        var options = {
            limit: 1,   // Max number of video clips in a single capture operation
            duration: 15,    // Max duration of each video clip
            quality: 1  // 0 means low quality, 1 means high quality
        };
    
        // console.log("You are allowed 15 seconds to record the video");
        // navigator.notification.alert('You are allowed 15 seconds to record the video', null, 'Alert', 'OK');    //wait for user to click ok and then start recording. Use a promise?
        navigator.device.capture.captureVideo(this.captureSuccess, this.captureError, options);
    }

    captureError(err) {
        this.err = err;
        this.setState({
            videoStatus: 'error'
        })
    }

    captureSuccess(s) {
        this.videoPath = s[0].fullPath;
        this.props.getVideoFilePath(this.videoPath);
        this.setState({
            videoStatus: 'success'
        });
    }

    renderVideo() {
        if (this.state.videoStatus === 'success') {
            return (
                <Row className="row-kuwa-reg">
                    <Col>
                        <video width="400" height="300" controls>
                            <source src={this.videoPath} type='video/mp4'/>
                        </video>
                        <h5>Video stored at: {this.videoPath}</h5>
                    </Col>
                </Row>
            );
        }
        let message = "No video recorded yet";
        if (this.err) {
            message = "Failed to record video " + JSON.stringify(this.err);
        }
        return (
            <Row className="row-kuwa-reg">
                <Col>
                    <h5>{message}</h5>
                </Col>
            </Row>
        );
    }

    render() {
        return (
            <Container>
                <Row className="row-kuwa-reg">
                    <Col>
                        <Button color="primary" onClick={this.takeVideo}>Take Video</Button>
                        <div id="videoArea"></div>
                        <div id="msg"></div>
                    </Col>
                </Row>
                {this.renderVideo()}
            </Container>
        );
    }
}