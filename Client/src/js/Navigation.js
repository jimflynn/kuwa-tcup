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
        <NavbarBrand href="/"><img src={logo} alt="logo" /></NavbarBrand>
        <NavbarToggler onClick={this.props.toggleCollapse} />
        <Collapse isOpen={!this.props.collapsed} navbar>
          <Nav className="ml-auto" navbar>
            {navigationLink(this.props)}
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
        <NavLink href="/client/">Home</NavLink>
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);