import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

	constructor() {
		super();
		this.state = {
			database:[]
		};
	}

	componentDidMount() {
		this.interval = setInterval(() => {
			fetch('/registrations')
			.then(response => response.json())
			.then(response => this.setState({database: response}))
			.then(console.log('DB =', this.state.database))
		}, 5000);
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
					{this.state.database.map((row, index) => 
					<tr key={index}>
						<td> {row.client_address} </td>
						<td> {row.client_contract_address} </td>
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
