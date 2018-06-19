import React, { Component } from 'react';
import keythereum from 'keythereum';
import SetPassword from './SetPassword';
import Loading from './Load';
import RequestSponsorship from './RequestSponsorship';
import UploadToStorage from './UploadToStorage';
import '../css/App.css';

/**
 * Loads different components depending on the state of the program
 * @class CreateKuwaId
 * @extends Component
 */
class CreateKuwaId extends Component {
  /**
   * Creates an instance of CreateKuwaId.
   * @param  {any} props 
   * @memberof CreateKuwaId
   */
  constructor(props) {
    super(props);
    this.createKeys = this.createKeys.bind(this);
    this.generateKeystore = this.generateKeystore.bind(this);
    this.processKeystore = this.processKeystore.bind(this);
    this.showRegistrationRequest = this.showRegistrationRequest.bind(this);
    this.showUploadToStorage = this.showUploadToStorage.bind(this);
    this.showLoading = this.showLoading.bind(this);
    this.hideLoading = this.hideLoading.bind(this);
    this.showRequestSponsorship = this.showRequestSponsorship.bind(this);
    this.hideRequestSponsorship = this.hideRequestSponsorship.bind(this);
    this.state = {
      showSetPassword: true,
      showLoading: false,
      showRequestSponsorship: false,
      showUploadToStorage: false
    }
  }

  /**
   * Creates a new public and private keypair
   * @return {void}@memberof CreateKuwaId
   */
  generateKeystore() {
    //defining parameters and options to create an ethereum wallet
    var params = { keyBytes: 32, ivBytes: 16 };
    var dk = keythereum.create(params);
    
    var kdf = "pbkdf2"; // or "scrypt" to use the scrypt kdf
    
    var options = {
      kdf: kdf,
      cipher: "aes-128-ctr",
      kdfparams: {
        c: 262144,
        dklen: 32,
        prf: "hmac-sha256"
      }
    };
    //The key object is generated using a combination of the password and private key. 
    keythereum.dump(this.password, dk.privateKey, dk.salt, dk.iv, options, this.processKeystore); 
  }

  /**
   * Decrypts keyobject with the password to get private key
   * @param  {KeyObject} keyObject 
   * @return {void}@memberof CreateKuwaId
   */
  processKeystore(keyObject) {
    if ( !keyObject ) {
      this.setState({
        showLoading: false
      });
      alert("An error occurred when generating keys.");
    } else {      
      this.kuwaId = '0x' + keyObject.address;
      keythereum.recover(this.password, keyObject, this.showRegistrationRequest);
    }
  }

  /**
   * Converts private key to hex and stores it in an instance variable and changes state to
   * show Request Sponsorship component
   * @param  {any} privateKey 
   * @return {void}@memberof CreateKuwaId
   */
  showRegistrationRequest(privateKey) {
    if ( !privateKey ) {
      this.setState({
        showLoading: false
      });
      alert("An error occurred when recovering private key.");
    } else {
      //TODO: Call Sponsor to get (1) a challenge phrase; (2) a KuwaRegistion contract's address; and (2) the contract's ABI.
      //TODO: Record a video of the registrant speaking the challenge phrase.	
      //The recovered private key will be in buffer and must be converted to Hex for readability.
      this.privateKey = '0x' + privateKey.toString('hex');
      this.setState({
        showLoading: false,
        showRequestSponsorship: true
      });
    }
  }

  /**
   * Calls the generateKeystore method by passing the encrypting password and shows the Loading
   * component
   * @param  {string} password 
   * @return {void}@memberof CreateKuwaId
   */
  createKeys(password) {
    this.showLoading('Generating Keys...');
    this.setState({
      showSetPassword: false
    });
    this.password = password;
    this.generateKeystore();
  }

  showLoading(loadingMessage) {
    this.loadingMessage = loadingMessage;
    this.setState({
      showLoading: true
    });
  }

  hideLoading() {
    this.setState({
      showLoading: false
    });
  }

  showRequestSponsorship() {
    this.setState({
      showRequestSponsorship: true
    })
  }

  hideRequestSponsorship() {
    this.setState({
      showRequestSponsorship: false
    })
  }

  /**
   * Sets the challenge generated in the Smart Contract to an instance variable and shows the
   * Upload to Storage component
   * @param  {number} challenge 
   * @return {void}@memberof CreateKuwaId
   */
  showUploadToStorage(challenge) {
    this.challenge = challenge;
    this.setState({
      showUploadToStorage: true
    });
  }

  render() {
    if (this.state.showSetPassword) {
      return (
        <SetPassword 
          createKeys = {password => this.createKeys(password)}
        />
      );
    } else if (this.state.showLoading) {
      return (
        <Loading 
          loadingMessage = {this.loadingMessage}
        />
      );
    } else if (this.state.showRequestSponsorship) {
      return (
        <RequestSponsorship 
          kuwaId = {this.kuwaId}
          privateKey = {this.privateKey}
          showLoading = {this.showLoading}
          hideLoading = {this.hideLoading}
          hideRequestSponsorship = {this.hideRequestSponsorship}
          showUploadToStorage = {challenge => this.showUploadToStorage(challenge)}
        />
      );
    } else if (this.state.showUploadToStorage) {
      return (
        <UploadToStorage 
          ethereumAddress = {this.kuwaId}
          challenge = {this.challenge}
        />
      );
    }
  }
}

export default CreateKuwaId;