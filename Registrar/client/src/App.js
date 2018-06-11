import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  state = {database:[]};

  componentDidMount() {
    this.callApi()
      .then(res => {
        this.setState({database: res});
        console.log('database =', this.state.database, '\n');
      })
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const database = await fetch('/registrations');
    const body = await database.json();

    if (database.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <table id="tableIdToFill">
          <thead>
          <tr>
              <th>Client Address</th>
              <th>Contract Adress</th>
              <th>Timestamp</th>
              <th>Registration Status</th>
          </tr>
          {this.state.database.map(row =>
            <tr>
              <td>{row.client_address}</td>
              <td>{row.client_contract_address}</td>
              <td>{row.timestamp}</td>
              <td>{row.status}</td>
            </tr>
          )}
          </thead>
        </table>
      </div>
    );
  }
}

export default App;
