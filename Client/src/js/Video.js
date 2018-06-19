import React, { Component } from 'react';
import { Button, Container, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';

export default class Video extends Component {
    constructor(props) {
        super(props);
        this.takeVideo = takeVideo.bind(this);
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
            </Container>
        );
    }
}

// document.addEventListener("deviceready", init, false);
	
// function init() {
//     document.querySelector("#takeVideo").addEventListener("touchend", takeVideo, false);
// }

function takeVideo() {
    var options = {
        limit: 1,   // Max number of video clips in a single capture operation
        duration: 15,    // Max duration of each video clip
        quality: 1  // 0 means low quality, 1 means high quality
    };

    console.log("You are allowed 15 seconds to record the video");
    navigator.notification.alert('You are allowed 15 seconds to record the video', null, 'Alert', 'OK');    //wait for user to click ok and then start recording. Use a promise?
    navigator.device.capture.captureVideo(captureSuccess, captureError, options);
}

function captureError(err) {
    console.log("Failed to record video " + JSON.stringify(err));
    navigator.notification.alert('Failed to record video: ' + err, null, 'Error', 'OK');
    document.querySelector('#videoArea').innerHTML = "";
    document.getElementById('msg').textContent = "No video recorded";
}

function captureSuccess(s) {
    console.log("Video successfully recorded");
    var v = "<video width=\"400\" height=\"300\" controls>";
        v += "<source src='" + s[0].fullPath + "' type='video/mp4'>";
        v += "</video>";
    document.querySelector('#videoArea').innerHTML = v;
    navigator.notification.confirm('Video successfully recorded', null, 'Success', ['OK']);
    document.querySelector('#msg').textContent = "Video stored at: " + s[0].fullPath;
}