import React from 'react';
import {
  Navbar,
  NavbarBrand } from 'reactstrap';
  import logo from './site-logo.png';

export default class Navigation extends React.Component {
  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/"><img src={logo} alt="logo" /></NavbarBrand>
        </Navbar>
      </div>
    );
  }
}