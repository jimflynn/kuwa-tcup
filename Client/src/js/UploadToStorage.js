import React, { Component } from 'react';
import { Button, Container, Row, Col, Badge, Collapse, Card, CardBody } from 'reactstrap';
import Video from './Video';
import '../css/App.css';

import { Loading } from './Load';

import { Provider } from 'react-redux';
import { store } from './store'
import { toggleCollapse } from './actions/screenActions';
import { webUploadToStorage, uploadToStorage  } from './actions/kuwaActions';
import { connect } from 'react-redux';

/**
 * Component that shows the upload screen of the video with the challenge recorded, the kuwa ID,
 * the contract ABI, and the contract address
 * @export
 * @class UploadToStorage
 * @extends Component
 */
class UploadToStorage extends Component {
  render() {
      if (this.props.loading) {
        return (
          <Loading loadingMessage={this.props.loadingMessage} />
        )
      }
      return (
        <div>
          {renderUploadToStorage(this.props)}
        </div>
      )
    }
  }

const renderUploadToStorage = props => {
  return (
    <Container>
      <Row className="row-kuwa-reg">
        <Col>
          <h2>
            <span className="header-kuwa-reg">Submit Your Kuwa ID Request</span>
            <Button color="primary" onClick={props.toggleCollapse} outline>
              <Badge color="primary">?</Badge>
            </Button>
          </h2>
        </Col>
      </Row>
      <Row className="row-kuwa-reg">
        <Col>
          <Collapse isOpen={!props.collapsed}>
            <Card className="elem-kuwa-reg">
              <CardBody>
                Some explanation.
              </CardBody>
            </Card>
          </Collapse>
        </Col>
      </Row>
      <Row className="row-kuwa-reg">
        <Col className="long-key">
          <strong>Ethereum Address: </strong>{props.ethereumAddress}
        </Col>
      </Row>
      <Row className="row-kuwa-reg">
        <Col>
          <strong>Challenge Phrase: </strong>{props.challenge === 0 ? "Challenge expired" : props.challenge}
        </Col>
      </Row>
      <Row>
        <Col>
          <Provider store={store}>
            <Video />
          </Provider>
        </Col>
      </Row>
      <Row className="row-kuwa-reg">
        <Col>
          {renderButton(props)}
        </Col>
      </Row>
    </Container>
  );
}
  
const renderButton = (props) => {
  if (props.videoStatus === 'success') {
    if(props.isMobile) {
      return(
        <Button color="primary" className="elem-kuwa-reg" onClick={() => props.uploadToStorage(props.videoFilePath, props.ethereumAddress, props.abi, props.contractAddress)}>Upload Information</Button>
      );
    } else {
      return(
        <Button color="primary" className="elem-kuwa-reg" onClick={() => props.webUploadToStorage(props.videoBlob, props.ethereumAddress, props.abi, props.contractAddress)}>Upload Information</Button>
      );
    }
  }
  return(
    <Row></Row>
  )
}

const mapStateToProps = state => {
  let currentKuwaId = state.kuwaReducer.currentKuwaId;
  return {
    isMobile: state.kuwaReducer.isMobile,
    collapsed: state.screenReducer.uploadToStorage.collapsed,
    ethereumAddress: state.kuwaReducer.kuwaIds[currentKuwaId].address,
    challenge: state.kuwaReducer.kuwaIds[currentKuwaId].challenge,
    abi: state.kuwaReducer.kuwaIds[currentKuwaId].abi,
    contractAddress: state.kuwaReducer.kuwaIds[currentKuwaId].contractAddress,
    videoStatus: state.videoReducer.videoStatus,
    videoFilePath: state.videoReducer.videoFilePath,
    videoBlob: state.videoReducer.videoBlob,
    loading: state.kuwaReducer.screen.uploadToStorage.loading,
    loadingMessage: state.kuwaReducer.screen.loading.helpText
  }
}

const mapDispatchToProps = dispatch => {
  return {
    uploadToStorage: (videoFilePath, ethereumAddress, abi, contractAddress) => {
      dispatch(uploadToStorage(videoFilePath, ethereumAddress, abi, contractAddress))
    },
    webUploadToStorage: (videoBlob, ethereumAddress, abi, contractAddress) => {
      dispatch(webUploadToStorage(videoBlob, ethereumAddress, abi, contractAddress))
    },
    toggleCollapse: () => {
      dispatch(toggleCollapse("uploadToStorage"))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadToStorage);