/**
 * @module Faucet landing page
 * @description Implementation of the Kuwa faucet, this is the landing page from which the valid kuwa IDs table component is rendered
 * @author The Kuwa Foundation / Hrishikesh Kashyap
 */
import React, { Component } from 'react';
import logo from './site-logo.png';
import './App.css';
import {
  Button,
  Navbar,
  NavbarBrand } from 'reactstrap';

import ValidKuwaIDs from './components/valid_kuwa_ids/valid_kuwa_ids';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          
  	<Navbar color="light" light expand="md">
          <NavbarBrand href="/"><img src={logo} alt="logo" /></NavbarBrand>
          <Button id="back-button" color="success" href="https://alpha.kuwa.org" >Back</Button>{' '}
        </Navbar>
          
          <h1 className="App-title">Edina Basic Income Faucet</h1>
          

        </header>
        <ValidKuwaIDs/>
      </div>
    );
  }
}

export default App;

