import React, { Component } from 'react';
import { Button, Container, Row, Col, Form, FormGroup, Label, Input, Badge, Collapse, Card, CardBody } from 'reactstrap';
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
      var formData = new FormData();
  
      var fileField = document.querySelector("input[type='file']");

      var videoFile = new File(this.videoFilePath, 'video');
      alert(this.videoFilePath);
      alert(videoFile);
  
      formData.append('ClientAddress',this.props.ethereumAddress);
      formData.append('ChallengeVideo',videoFile);
      formData.append('ContractABI',JSON.stringify(this.props.sponsorResponse.abi));
      formData.append('ContractAddress',this.props.sponsorResponse.contractAddress);
      try {
        this.props.showLoading('Uploading Information. This may take several minutes.');
        this.props.hideUploadToStorage();
        let response = await fetch('http://alpha.kuwa.org:3002/KuwaRegistration/', {
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
              <Form>
                <FormGroup>
                  <Label for="videoFile">File</Label>
                  <Input type="file" id="videoFile" />
                </FormGroup>
                <Button color="primary" onClick={this.uploadToStorage}>Upload Info</Button>
              </Form>
            </Col>
          </Row>
        </Container>
      );
    }
  }
  
  var toggle = function() {
    this.setState({ collapse: !this.state.collapse });
  }