import React, { Component } from 'react';
import { Button, Container, Row, Col } from 'reactstrap';

import { captureVideo } from './actions/videoActions';
import { connect } from 'react-redux';

import videojs from 'video.js';
import 'webrtc-adapter';

// var record = require('videojs-record')
import record from 'videojs-record/dist/videojs.record.js';

class Video extends Component {
    componentDidMount() {
        if (!this.props.isMobile) {
            const videoJsOptions = {
                controls: true,
                width: 320,
                height: 240,
                fluid: false,
                plugins: {
                    record: {
                        audio: true,
                        video: true,
                        maxLength: 15,
                        debug: true
                    }
                }
            };
    
            // instantiate Video.js
            this.player = videojs("webVideo", videoJsOptions, function onPlayerReady(){
                // print version information at startup
                var msg = 'Using video.js ' + videojs.VERSION +
                    ' with videojs-record ' + videojs.getPluginVersion('record')
                videojs.log(msg);
            });
    
            // error handling
            this.player.on('error', function(error) {
                console.warn(error);
            });

            // user clicked the record button and started recording !
            this.player.on('startRecord', function() {
                console.log('started recording! Do whatever you need to');
            });

            // user completed recording and stream is available
            // Upload the Blob to your server or download it locally !
            this.player.on('finishRecord', function() {

                // the blob object contains the recorded data that
                // can be downloaded by the user, stored on server etc.
                var videoBlob = this.player.recordedData.video;

                console.log('finished recording: ', videoBlob);
            });
        }
    }

    // destroy player on unmount
    componentWillUnmount() {
        if (!this.props.isMobile) {
            if (this.player) {
                this.player.dispose();
            }
        }
    }

    render() {
        return (
            <Container>
                {renderButton(this.props)}
                {renderVideo(this.props)}
            </Container>
        );
    }
}

const renderButton = (props) => {
    if(props.isMobile) {
        return (
            <Row className="row-kuwa-reg">
                <Col>
                    <Button color="primary" onClick={props.captureVideo}>Take Video</Button>
                </Col>
            </Row>
        )
        return null
    }
}

const renderVideo = (props) => {
    if(!props.isMobile) {
        return (
            <video id="webVideo" className="video-js vjs-default-skin"></video>
        )
    }
    if (props.videoStatus === 'success') {
        return (
            <Row className="row-kuwa-reg">
                <Col>
                    <video width={getVideoWidth()} height={getVideoHeight()} controls>
                        <source src={props.videoFilePath} type='video/mp4'/>
                    </video>
                </Col>
            </Row>
        );
    }
    let message = "Waiting for new video to be recorded";
    if (props.videoError !== "") {
        message = "Failed to record video " + props.videoError;
    }
    return (
        <Row className="row-kuwa-reg">
            <Col>
                <h5>{message}</h5>
            </Col>
        </Row>
    );
}

const getVideoHeight = () => {
    return (window.innerHeight * 0.6).toString();
}

const getVideoWidth = () => {
    let ratio = window.innerWidth / window.innerHeight;
    let newHeight = window.innerHeight * 0.6;
    return Math.round(ratio * newHeight).toString();
}

const mapStateToProps = state => {
    return {
        videoStatus: state.videoReducer.videoStatus,
        videoFilePath: state.videoReducer.videoFilePath,
        videoError: state.videoReducer.videoError,
        isMobile: state.kuwaReducer.isMobile
    }
  }
  
const mapDispatchToProps = dispatch => {
    return {
        captureVideo: () => {
            dispatch(captureVideo())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Video);