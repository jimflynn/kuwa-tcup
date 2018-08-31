import React, { Component } from 'react';
import './sponsorship_requests.css';
import axios from 'axios';
import Popup from 'reactjs-popup';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';  
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import loading from '../../loading.gif'

function blockLinks(cell, row){
  return `<a href="https://rinkeby.etherscan.io/address/${cell}" target="_blank">${cell}</a>`;
}

class SponsorshipRequests extends Component {

  constructor(props) {
    super(props);

    this.options = {
      defaultSortName: 'timestamp',  // default sort column name
      defaultSortOrder: 'desc'  // default sort order
    };

    this.state = {
      isLoading: true,
      sponsorship_requests: []
    }

    this.toggle = this.toggle.bind(this);
  }


  toggle() {
    this.setState({
      isLoading: !this.state.isLoading
    });
  }


  componentDidMount(){
    
     this.interval = setInterval(() => {
        axios.get('/sponsorship_requests/Test')
         .then(res => {
          console.log(res.data);
          this.setState({sponsorship_requests : res.data.sponsorship_requests});
          this.setState({isLoading : false});
        })}, 1000);
   }

  componentWillUnmount() {
  clearInterval(this.interval);
  }

  render() {
    if(this.state.isLoading === false){
     return (
      <div>
        <h2> Sponsorship Requests</h2>
          <BootstrapTable data={this.state.sponsorship_requests} options={this.options}>
            
              <TableHeaderColumn dataField="timestamp" filter={ { type: 'TextFilter', delay: 200 }} isKey dataSort> Time </TableHeaderColumn>
              <TableHeaderColumn dataField="ip" filter={ { type: 'TextFilter', delay: 200 }} dataSort> IP Address </TableHeaderColumn>
              <TableHeaderColumn dataField="client_address" filter={ { type: 'TextFilter', delay: 200 }} dataSort> Kuwa ID (Ethereum Address)</TableHeaderColumn>
              <TableHeaderColumn dataField="contract_address" filter={ { type: 'TextFilter', delay: 200 }} dataSort dataFormat={blockLinks} > Registration Contract Address</TableHeaderColumn>

        </BootstrapTable>
      </div>
    ); 
    }
    else{
      return (
      <div className="loading">
      
      <img className="isLoading" src={loading} alt="loading..." />

      </div>
      );
    }
    
  }
}

export default SponsorshipRequests;
  
