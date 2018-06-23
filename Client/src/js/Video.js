import React, { Component } from 'react';
import { Button, Container, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';

export default class Video extends Component {
    constructor(props) {
        super(props);
        this.takeVideo = this.takeVideo.bind(this);
        this.captureVideo = this.captureVideo.bind(this);
        this.captureError = this.captureError.bind(this);
        this.captureSuccess = this.captureSuccess.bind(this);
        this.renderVideo = this.renderVideo.bind(this);
        this.getVideoHeight = this.getVideoHeight.bind(this);
        this.getVideoWidth = this.getVideoWidth.bind(this);
        this.state = {
            videoStatus: 'waiting'
        }
    }

    takeVideo() {
        // console.log("You are allowed 15 seconds to record the video");
        this.err = undefined;
        this.setState({videoStatus: 'waiting'});
        this.props.setVideoStatus('waiting');
        navigator.notification.alert('You are allowed 15 seconds to record the video', this.captureVideo, 'Alert', 'OK');
    }

    captureVideo() {
        var options = {
            limit: 1,   // Max number of video clips in a single capture operation
            duration: 15,    // Max duration of each video clip
            quality: 1  // 0 means low quality, 1 means high quality
        };
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
        this.props.setVideoStatus('success');
    }

    renderVideo() {
        if (this.state.videoStatus === 'success') {
            return (
                <Row className="row-kuwa-reg">
                    <Col>
                        <video width={this.getVideoWidth()} height={this.getVideoHeight()} controls>
                            <source src={this.videoPath} type='video/mp4'/>
                        </video>
                    </Col>
                </Row>
            );
        }
        let message = "Waiting for new video to be recorded";
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

    getVideoHeight() {
        return (window.innerHeight * 0.6).toString();
    }

    getVideoWidth() {
        let ratio = window.innerWidth / window.innerHeight;
        let newHeight = window.innerHeight * 0.6;
        return Math.round(ratio * newHeight).toString();
    }

    render() {
        return (
            <Container>
                <Row className="row-kuwa-reg">
                    <Col>
                        <Button color="primary" onClick={this.takeVideo}>Take Video</Button>
                    </Col>
                </Row>
                {this.renderVideo()}
            </Container>
        );
    }
}
