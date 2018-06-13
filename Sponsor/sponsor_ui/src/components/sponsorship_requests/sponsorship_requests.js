import React, { Component } from 'react';
import './sponsorship_requests.css';
import axios from 'axios';
import Popup from 'reactjs-popup';
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
  DropdownItem } from 'reactstrap';


class SponsorshipRequests extends Component {

  constructor() {
    super();
    this.state = {
      sponsorship_requests: []
    }
  }

  componentDidMount(){
    
     this.interval = setInterval(() => {
        axios.get('/sponsorship_requests/MySharedSecretKey')
         .then(res => {
          console.log(res.data);
          this.setState({sponsorship_requests : res.data.sponsorship_requests});
        })}, 1000);

    //example get request to verify ajax is working

    // axios.get('https://api.iextrading.com/1.0/ref-data/symbols')
    //      .then(res => {
    //       console.log(res.data);
    //       this.setState({sponsorship_requests : res.data[0]});
    //     })      

    //update: it is working but ajax cant track changes in database without a page refresh.

    // axios.get('/sponsorship_requests/MySharedSecretKey')
    //      .then(res => {
    //       console.log(res.data);
    //       this.setState({sponsorship_requests : res.data.sponsorship_requests});
    //     })      



   }

  componentWillUnmount() {
  clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <h2> Sponsorship Requests</h2>
          <table>
            <tr>
              <th> Time </th>
              <th> IP address </th>
              <th> Address </th>
              <th> Contract Address </th>
            </tr>

          {this.state.sponsorship_requests.map(sponsorship_requests =>  
             
            <tr key={sponsorship_requests.sponsorship_request_id}>  
                <td>{sponsorship_requests.date_time}</td> 
                <td>{sponsorship_requests.ip} </td> 
                <td><Popup trigger={<button className="button"> Display </button>} modal>
    {close => (
      <div className="modal">
        
        
        <div className="content">
          {sponsorship_requests.registration_request_address}
        </div>
        <div className="actions">
        </div>
      </div>
    )}
  </Popup></td> 
                <td id="contractAddress">
                  <Popup trigger={<button className="button"> Display </button>} modal>
    {close => (
      <div className="modal">
        
        
        <div className="content">
          {" "}
          {sponsorship_requests.registration_request_address}
        </div>
        <div className="actions">
        </div>
      </div>
    )}
  </Popup>
                </td>    
            </tr> 
            )} 

        </table>
      </div>
    );
  }
}

export default SponsorshipRequests;
  