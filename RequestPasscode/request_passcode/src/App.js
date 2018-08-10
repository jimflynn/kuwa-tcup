import React, { Component } from 'react';
import Navigation from './Navigation';
import RequestPasscode from './js/request_passcode';
import './App.css';

/**
 * Loads different components depending on the state of the program
 * @class CreateKuwaId
 * @extends Component
 */
class App extends Component {
  render() {
    return (
      <div className="App">
        <div>
              <Navigation />
              <RequestPasscode />              
        </div>

        
      </div>
    )
  }
}


export default App;