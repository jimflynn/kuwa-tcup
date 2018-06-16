import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

    constructor() {
        super();
        this.state = {
            registrations:[]
        };
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            fetch('/registration')
	            .then(response => response.json())
	            .then(table => this.setState({registrations: table}))
	            .then(console.log('DB =', this.state.registrations))
        }, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Kuwa Registrar Database</h1>
                </header>
                <table id="tableIdToFill">
                    <thead>
                        <tr>
                            <th>Client Address</th>
                            <th>Contract Address</th>
                            <th>Timestamp</th>
                            <th>Registration Status</th>
                        </tr>
                    </thead>
                    <thead>
                        {this.state.registrations.map((row, index) => 
                        <tr key={row.registration_id}>
                            <td> {row.client_address} </td>
                            <td> {row.contract_address} </td>
                            <td> {row.timestamp} </td>
                            <td> {row.status} </td>
                        </tr>
                        )}
                    </thead>
                </table>
            </div>
        );
    }
}

export default App;
