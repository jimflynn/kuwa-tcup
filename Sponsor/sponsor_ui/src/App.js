import React, { Component } from 'react';
import logo from './site-logo.png';
import './App.css';
import {
  Button,
  Navbar,
  NavbarBrand } from 'reactstrap';

import SponsorshipRequests from './components/sponsorship_requests/sponsorship_requests';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          
  	<Navbar color="light" light expand="md">
          <NavbarBrand href="/"><img src={logo} alt="logo" /></NavbarBrand>
          <Button id="back-button" color="success" href="https://alpha.kuwa.org/sponsor" >Back</Button>{' '}
        </Navbar>
          
          <h1 className="App-title">Welcome to The Louise Sponsor page</h1>
          

        </header>
        <SponsorshipRequests/>
      </div>
    );
  }
}

export default App;

