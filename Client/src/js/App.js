import React, { Component } from 'react';
import Navigation from './Navigation';
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
    return (
      <div>
        <Provider store={store}>
          <Navigation />
        </Provider>
        <Provider store={store}>
          {renderScreen(this.props)}
        </Provider>
      </div>
    )
  }
}

const renderScreen = (props) => {
  switch(props.screen.screenName) {
    case 'SET_PASSWORD':
      return(
          <SetPassword />
      )
    case 'LOADING':
      return (
        <Loading loadingMessage={props.screen.helpText} />
      )
    case 'SUCCESS':
      return (
        <Success successMessage={props.screen.helpText} />
      )
    case 'ERROR':
      return (
        <Error errorMessage={props.screen.helpText} />
      )
    case 'REQUEST_SPONSORSHIP':
      return (
          <RequestSponsorship />
      )
    case 'UPLOAD_TO_STORAGE':
      return (
          <UploadToStorage />
      )
    default:
      return (
        <Error errorMessage="ERROR LOADING SCREEN" />
      )
  }
}

const mapStateToProps = state => {
  return {
    screen: state.kuwaReducer.screen
  }
}

export default connect(mapStateToProps)(CreateKuwaId);