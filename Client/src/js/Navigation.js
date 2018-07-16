import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink } from 'reactstrap';
  import logo from '../img/site-logo.png';
  import { toggleCollapse } from './actions/screenActions';
  import { connect } from 'react-redux';
import { push } from 'connected-react-router';

/**
 * Shows the navigation bar of The Kuwa Foundation
 * @export
 * @class Navigation
 * @extends React.Component
 */
class Navigation extends React.Component {
  render() {
    return (
      <Navbar color="light" light expand="md">    
        <NavbarBrand href="javascript:void(0);" onClick={() => this.props.navigateTo('/')}><img src={logo} alt="logo" /></NavbarBrand>
        <NavbarToggler onClick={this.props.toggleCollapse} />
        <Collapse isOpen={!this.props.collapsed} navbar>
          <Nav className="ml-auto" navbar>
            {navigationLink(this.props)}
            <NavItem>
              <NavLink href="javascript:void(0);" onClick={() => this.props.navigateTo('/QRCodeGen')}>QR Code</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="http://kuwa.io/">Kuwa</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    )
  }
}

const navigationLink = (props) => {
  if(!props.isMobile) {
    return (
      <NavItem>
        <NavLink href="javascript:void(0);" onClick={() => props.navigateTo('/')}>Home</NavLink>
      </NavItem>
    )
  }
  return null;
}

const mapStateToProps = state => {
  return {
    collapsed: state.screenReducer.navigation.collapsed,
    isMobile: state.kuwaReducer.isMobile
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleCollapse: () => {
      dispatch(toggleCollapse("navigation"))
    },
    navigateTo: link => {
      dispatch(push(link))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);