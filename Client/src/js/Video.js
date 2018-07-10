import React, { Component } from 'react';
import { Button, Container, Row, Col } from 'reactstrap';

import { captureVideo } from './actions/videoActions';
import { connect } from 'react-redux';

class Video extends Component {
    render() {
        return (
            <Container>
                <Row className="row-kuwa-reg">
                    <Col>
                        <Button color="primary" onClick={this.props.captureVideo}>Take Video</Button>
                    </Col>
                </Row>
                {renderVideo(this.props)}
            </Container>
        );
    }
}

const renderVideo = (props) => {
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