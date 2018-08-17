import React, { Component } from 'react';
import logo from './Kuwa.png';
import './App.css';
import Navigation from './Navigation.js';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            registrations:[],
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
            <Navigation />
                <header className="App-header">
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Kuwa Registrar Database (Moe)</h1>
                </header>
                <BootstrapTable ref='table' data={this.state.registrations}>
                    <TableHeaderColumn 
                        width='5%' 
                        dataSort={ true } 
                        dataAlign='center' 
                        dataField='registration_id' 
                        isKey >
                            ID 
                    </TableHeaderColumn>

                    <TableHeaderColumn 
                        width='30%' 
                        dataSort={ true } 
                        dataAlign='center' 
                        dataField='client_address'> 
                            Client Address
                    </TableHeaderColumn>

                    <TableHeaderColumn 
                        width='30%' 
                        dataSort={ true } 
                        dataAlign='center' 
                        dataField='contract_address'>
                            Contract Address
                    </TableHeaderColumn>

                    <TableHeaderColumn 
                        width='18%' 
                        dataSort={ true } 
                        dataAlign='center' 
                        dataField='timestamp' >
                            Timestamp(EDT)
                    </TableHeaderColumn>

                    <TableHeaderColumn 
                        width='17%' 
                        dataSort={ true } 
                        dataAlign='center' 
                        dataField='status' >
                            Status
                    </TableHeaderColumn>
                </BootstrapTable>
                {/*<table id="tableIdToFill">
                <tbody>
                <tr>
                    <th>Index</th>
        	        <th>Client Address</th>
                	<th>Contract Address</th>
                    <th>Timestamp(UTC)</th>
	                <th>Registration Status</th>
        	    </tr>
                {this.state.registrations.map((row, index) =>
		        <tr key={row.registration_id}>
                    <td>{index+1}</td>
	                <td><a href={"https://rinkeby.etherscan.io/address/"+row.client_address}
                                target="_blank" rel="noopener noreferrer">{row.client_address}</a></td>
	                <td><a href={"https://rinkeby.etherscan.io/address/"+row.contract_address}
                                target="_blank" rel="noopener noreferrer">{row.contract_address}</a></td>
        	        <td>{row.timestamp}</td>
                	<td>{row.status}</td>
                </tr>)}
			    </tbody>
                </table>*/}
            </div>
        );
    }
}

export default App;
