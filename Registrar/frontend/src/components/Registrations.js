import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import loading from '../loading.gif';

class Registrations extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			registrations:[],
		};
		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.setState({isLoading: !this.state.isLoading});
	}

	componentDidMount() {
		this.interval = setInterval(() => {
			fetch('/registration')
				.then(response => response.json())
				.then(table => this.setState({registrations: table}))
				.then(console.log('DB =', this.state.registrations))
				.then(this.setState({isLoading : false}))
                .then(console.log("isLoading = " + this.state.isLoading))
		}, 3000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		if(this.state.isLoading === false) {
			return (
                <div>
					<BootstrapTable ref='table' data={this.state.registrations}>
						<TableHeaderColumn width='5%'  dataSort={true} dataAlign='center' dataField='registration_id' isKey >
						ID
						</TableHeaderColumn>
						
						<TableHeaderColumn width='30%' dataSort={true} dataAlign='center' dataField='client_address'>
						Client Address
						</TableHeaderColumn>
						
						<TableHeaderColumn width='30%' dataSort={true} dataAlign='center' dataField='contract_address'>
						Contract Address
						</TableHeaderColumn>

						<TableHeaderColumn width='18%' dataSort={true} dataAlign='center' dataField='timestamp' >
						Timestamp(EDT)
						</TableHeaderColumn>

						<TableHeaderColumn width='17%' dataSort={true} dataAlign='center' dataField='status' >
						Status
						</TableHeaderColumn>
					</BootstrapTable>
				</div>
			);
        }
		else {
			return (
				<div className="loading">
					<img className="isLoading" src={loading} alt="Loading Data..." />
				</div>
			);
		}
	}
}

export default Registrations;

