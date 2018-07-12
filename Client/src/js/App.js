import React, { Component } from 'react';
import SetPassword from './SetPassword';
import { Loading } from './Load';
import { Success } from './Success';
import { Error } from './Error';
import RequestSponsorship from './RequestSponsorship';
import UploadToStorage from './UploadToStorage';
import '../css/App.css';

import { connect } from 'react-redux';
import { Provider } from 'react-redux';
import { store } from './store'

/**
 * Loads different components depending on the state of the program
 * @class CreateKuwaId
 * @extends Component
 */
class CreateKuwaId extends Component {
  render() {
    switch(this.props.screen.screenName) {
      case 'SET_PASSWORD':
        return(
          <Provider store={store}>
            <SetPassword />
          </Provider>
        )
      case 'LOADING':
        return (
          <Loading loadingMessage={this.props.screen.helpText} />
        )
      case 'SUCCESS':
        return (
          <Success successMessage={this.props.screen.helpText} />
        )
      case 'ERROR':
        return (
          <Error errorMessage={this.props.screen.helpText} />
        )
      case 'REQUEST_SPONSORSHIP':
        return (
          <Provider store={store}>
            <RequestSponsorship />
          </Provider>
        )
      case 'UPLOAD_TO_STORAGE':
        return (
          <Provider store={store}>
            <UploadToStorage />
          </Provider>
        )
      default:
        return (
          <Loading loadingMessage="ERROR LOADING SCREEN" />
        )
    }
    
  }
}

const mapStateToProps = state => {
  return {
    screen: state.kuwaReducer.screen
  }
}

export default connect(mapStateToProps)(CreateKuwaId);