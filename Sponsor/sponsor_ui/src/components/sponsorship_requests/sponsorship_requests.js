import React, { Component } from 'react';
import './sponsorship_requests.css';
import axios from 'axios';



class SponsorshipRequests extends Component {

  constructor() {
    super();
    this.state = {
      sponsorship_requests: []
    }
  }

  componentDidMount(){
    fetch('/sponsorship_requests/MySharedSecretKey')
      .then(sponsorship_requests => this.setState({sponsorship_requests : sponsorship_requests.sponsorship_requests}, () => {
      console.log('sponsorship requests fetched..', sponsorship_requests)}));
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
                <td></td>
                <td id="contractAddress">{sponsorship_requests.registration_request_address}</td>   
            </tr>
            )}

        </table>
      </div>
    );
  }
}

export default SponsorshipRequests;
