import React, { Component } from 'react';
import Navigation from './Navigation';
import BottomNavigation from './BottomNavigation';

import Steps from './Steps';
import ProvideCredentials from './ProvideCredentials';
import RecordRegistrationVideo from './RecordRegistrationVideo';
import YourKuwaId from './YourKuwaId';
import YourStatus from './YourStatus';
import YourNetwork from './YourNetwork';

import Success from './Success';
import Error from './Error';
// import QRCodeGen from './QRCodeGen';
import '../css/App.css';

import { connect } from 'react-redux';
import { Provider } from 'react-redux';
import { store } from './store';
import { history } from './store';

import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';

import { toggleRestoreState } from './actions/screenActions';
import { restoreStateOnMobile } from './actions/kuwaActions';

/**
 * Loads different components depending on the state of the program
 * @class CreateKuwaId
 * @extends Component
 */
class App extends Component {
  componentDidMount() {
    if (window.usingCordova) {
      this.props.restoreStateOnMobile(this.props.toggleRestoreState.bind(this))
    }
  }
  render() {
    return (
      <div>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <div>
              <Navigation />
              <Switch>
                <Route exact path='/' component={Steps}/>
                <Route exact path='/ProvideCredentials' component={ProvideCredentials}/>
                <Route exact path='/RecordRegistrationVideo' component={RecordRegistrationVideo}/>
                <Route exact path='/YourKuwaId' component={YourKuwaId}/>
                <Route exact path='/YourStatus' component={YourStatus}/>
                <Route exact path='/YourNetwork' component={YourNetwork}/>
                <Route exact path='/Error' component={Error}/>
                <Route exact path='/Success' component={Success}/>
              </Switch>
              <BottomNavigation />
            </div>
          </ConnectedRouter>
        </Provider>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    screen: state.kuwaReducer.screen,
    pathname: state.router.location.pathname,
    search: state.router.location.search,
    hash: state.router.location.hash,
    helpText: {
      success: state.kuwaReducer.screen.success.helpText,
      error: state.kuwaReducer.screen.error.helpText
    }
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleRestoreState: () => {
        dispatch(toggleRestoreState())
    },
    restoreStateOnMobile: (onSuccess) => {
      dispatch(restoreStateOnMobile(onSuccess))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);