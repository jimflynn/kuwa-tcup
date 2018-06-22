import React, { Component } from 'react';
import { Button, Container, Row, Col, Badge, Collapse, Card, CardBody } from 'reactstrap';
import Video from './Video';
import '../css/App.css';

/**
 * Component that shows the upload screen of the video with the challenge recorded, the kuwa ID,
 * the contract ABI, and the contract address
 * @export
 * @class UploadToStorage
 * @extends Component
 */
export default class UploadToStorage extends Component {
    /**
     * Creates an instance of UploadToStorage.
     * @param  {any} props 
     * @memberof UploadToStorage
     */
    constructor(props) {
      super(props);
      this.toggle = toggle.bind(this);
      this.state = {
        collapse: false
      }
      this.uploadToStorage = this.uploadToStorage.bind(this);
      this.getVideoFilePath = this.getVideoFilePath.bind(this);
    }
  
    getVideoFilePath(videoFilePath) {
      this.videoFilePath = videoFilePath;
    }
  
    /**
     * Sends challenge recorded, the kuwa ID, the contract ABI, and the contract address
     * @return 
     * @memberof UploadToStorage
     */
    async uploadToStorage() {
      this.props.showLoading('Uploading Information. This may take several minutes.');
      this.props.hideUploadToStorage();
      let formData = new FormData();
  
      let videoFilePath = this.videoFilePath;

      let resolveLocalFileSystemUtil = new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(videoFilePath, successOnFile, null)
        function successOnFile(fileEntry) {
          fileEntry.file(file => resolve(file));
        }
      });
      let file = await resolveLocalFileSystemUtil;

      let reader = new FileReader();
      let loadVideo = new Promise((resolve, reject) => {
        reader.onloadend = (e) => {
          let videoBlob = new Blob([reader.result], { type:file.type});
          resolve(videoBlob);
        }
      });
      reader.readAsArrayBuffer(file);
      let videoFile = await loadVideo;
  
      formData.append('ClientAddress',this.props.ethereumAddress);
      formData.append('ChallengeVideo',videoFile);
      formData.append('ContractABI',JSON.stringify(this.props.sponsorResponse.abi));
      formData.append('ContractAddress',this.props.sponsorResponse.contractAddress);
      try {
        let response = await fetch('http://alpha.kuwa.org:3002/KuwaRegistration/', {
        // let response = await fetch('http://localhost:3002', {
          method: 'POST',
          body: formData
        })
        alert("Success!");
      } catch(e){
        alert(e);
        alert("There was an error. Please try later");
      }
      this.props.showUploadToStorage();
      this.props.hideLoading();
    }
  
    render() {
      return(
        <Container>
          <Row className="row-kuwa-reg">
            <Col>
              <h2>
                <span className="header-kuwa-reg">Submit Your Kuwa ID Request</span>
                <Button color="primary" onClick={this.toggle} outline>
                  <Badge color="primary">?</Badge>
                </Button>
              </h2>
            </Col>
          </Row>
          <Row className="row-kuwa-reg">
            <Col>
              <Collapse isOpen={this.state.collapse}>
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
              <strong>Ethereum Address: </strong>{this.props.ethereumAddress}
            </Col>
          </Row>
          <Row className="row-kuwa-reg">
            <Col>
              <strong>Challenge Phrase: </strong>{this.props.challenge === 0 ? "Challenge expired" : this.props.challenge}
            </Col>
          </Row>
          <Row>
            <Col>
              <Video 
                getVideoFilePath = {videoFilePath => this.getVideoFilePath(videoFilePath)}
              />
            </Col>
          </Row>
          <Row className="row-kuwa-reg">
            <Col>
              <Button color="primary" onClick={this.uploadToStorage}>Upload Info</Button>
            </Col>
          </Row>
        </Container>
      );
    }
  }
  
  var toggle = function() {
    this.setState({ collapse: !this.state.collapse });
  }