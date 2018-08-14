import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
const buttonColor = "#11B73F";

import { captureVideo, webStartVideo, webFinishedVideo, webErrorVideo } from './actions/videoActions';
import { connect } from 'react-redux';

import videojs from 'video.js';
import 'webrtc-adapter';

/**
 * This component controls whether to launch the Android camera or the Webcam depending on
 * what the user is using. In case it is the Web Client, the video.js package is used. In case
 * it is the Cordova application the media capture plugin is used.
 * @class Video
 * @extends Component
 */
class Video extends Component {
    componentDidMount() {
        if (!window.usingCordova) {
            const videoJsOptions = {
                controls: true,
                width: getVideoWidth(),
                height: getVideoHeight(),
                fluid: false,
                plugins: {
                    record: {
                        audio: true,
                        video: true,
                        maxLength: 15,
                        debug: true,
                        videoMimeType: 'video/webm;codecs=H264'
                    }
                }
            };

            let props = this.props
    
            this.player = videojs("webVideo", videoJsOptions, function onPlayerReady(){
                var msg = 'Using video.js ' + videojs.VERSION +
                    ' with videojs-record ' + videojs.getPluginVersion('record')
                videojs.log(msg);
            });
    
            this.player.on('error', function(error) {
                props.webErrorVideo(error);
            });

            this.player.on('startRecord', function() {
                props.webStartVideo();
            });

            let player = this.player;
            this.player.on('finishRecord', function() {
                let videoBlob = player.recordedData.video;
                props.webFinishedVideo(videoBlob);
            });
        }
    }

    // destroy player on unmount
    componentWillUnmount() {
        if (!window.usingCordova) {
            if (this.player) {
                this.player.dispose();
            }
        }
    }

    render() {
        return (
            <Grid container justify="center">
                {renderButton(this.props)}
                {renderVideo(this.props)}
            </Grid>
        );
    }
}

const renderButton = (props) => {
    if(window.usingCordova) {
        return (
            <Grid container justify="center">
                <Button variant="contained" style={{backgroundColor: buttonColor}} onClick={props.captureVideo}>
                    Record Video <i class="material-icons">videocam</i>
                </Button>
            </Grid>
        )
        return null
    }
}

const renderVideo = (props) => {
    if(!window.usingCordova) {
        return (
            <Grid container justify="center">
                <video id="webVideo" className="video-js vjs-default-skin"></video>
            </Grid>
        )
    }
    if (props.videoStatus === 'success') {
        return (
            <Grid container justify="center" style={{margin: "1em"}}>
                <video width={getVideoWidth()} height={getVideoHeight()} controls>
                    <source src={props.videoFilePath} type='video/mp4'/>
                </video>
            </Grid>
        );
    }
    let message = "Waiting for new video to be recorded";
    if (props.videoError !== "") {
        message = "Failed to record video " + props.videoError;
    }
    return (
        <Grid container justify="center">
            <h5>{message}</h5>
        </Grid>
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
        videoError: state.videoReducer.videoError
    }
  }
  
const mapDispatchToProps = dispatch => {
    return {
        captureVideo: () => {
            dispatch(captureVideo())
        },
        webStartVideo: () => {
            dispatch(webStartVideo())
        },
        webFinishedVideo: (videoBlob) => {
            dispatch(webFinishedVideo(videoBlob))
        },
        webErrorVideo: (videoError) => {
            dispatch(webErrorVideo(videoError))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Video);