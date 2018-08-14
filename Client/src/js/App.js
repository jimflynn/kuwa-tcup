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
 * This is where the magic begins. As soon as the application loads, if the Client is using
 * cordova, it will check if it has previously created a Kuwa ID by checking if there are
 * any persisted wallets in his phone. If so, a screen will pop asking the user to input
 * the Kuwa password. Otherwise, the Steps component will be rendered.
 * The entire application uses redux and connected router. Therefore, there is a store
 * that is passed down to the components using the Provider tag. Connected Router is used
 * to make navigation in the app possible (back and forth). Refer to the online documentation
 * of this packages (Redux and Connected Router) to learn more about them.
 * All of the components use the material-ui (https://material-ui.com/getting-started/installation/)
 * for React. Refer to the documenation to understand the rest of the componenets.
 * @class App
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