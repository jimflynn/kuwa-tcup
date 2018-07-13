import React, { Component } from 'react';
import logo from './kuwa_logo.png';
import './App.css';


class App extends Component {
  

  constructor () {
  super()
  this.state = {
    KuwaIDList: ''
  }
  this.handleClick = this.handleClick.bind(this)
  }

  handleClick = () => {
    console.log('Button is clicked!!');
    
    this.setState({KuwaIDList: 'xpub6Cg17gepLkXu8uM1Q8Y5ZRCg2yNcbDHcHrBF955LGtL7Tg9cec9xpCzMzEVs9uRSUvwCsh\nxpub6BiWuCaFQEkfHWniH5385b3Ffc7asL6QzWFF5GmbTZMNHRB6StK699QbtGVcA\nxpub6Cs8CzmVHxWCxQdGZY5VFCjnp5fZNf4TLErmaprJdps8y3wePuV7sNnPq7PUj8vwXaed'})

  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to the Kuwa Faucet (Edina)</h1>
        </header>
        
        <button onClick={this.handleClick}>Get Valid Kuwa IDs</button>

        <p style={{whiteSpace:"pre"}}>{this.state.KuwaIDList}</p>
      </div>
    );
  }
}

export default App;
