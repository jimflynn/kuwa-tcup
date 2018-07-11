import React from 'react';
import {
  Navbar,
  NavbarBrand } from 'reactstrap';
  import logo from '../img/site-logo.png';

/**
 * Shows the navigation bar of The Kuwa Foundation
 * @export
 * @class Navigation
 * @extends React.Component
 */
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