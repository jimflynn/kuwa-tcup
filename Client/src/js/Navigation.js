import React from 'react';
import { Navbar, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact';
import { toggleCollapse, toggleDropdown } from './actions/screenActions';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { generalNavigation } from './generalNavigation';

/**
 * Shows the navigation bar of The Kuwa Foundation
 * @export
 * @class Navigation
 * @extends React.Component
 */
class Navigation extends React.Component {
    render() {
        if (window.isMobile) {
            return mobileNav(this.props)
        }
        return generalNavigation(this.props, clientNav(this.props));
    }
}

const clientNav = props => (
    <NavItem>
        <Dropdown isOpen={!props.dropdownRegistrationActions} toggle={() => props.toggleDropdown("registrationActions")}>
        <DropdownToggle nav caret>REGISTRATION ACTIONS</DropdownToggle>
        <DropdownMenu>
            <DropdownItem href="#">Get ID status</DropdownItem>
            <DropdownItem href="#">Show your ID</DropdownItem>
            <DropdownItem href="#">Scan an ID</DropdownItem>
            <DropdownItem href="#">Export your ID</DropdownItem>
        </DropdownMenu>
        </Dropdown>
    </NavItem>
)

const mobileNav = props => (
    <Navbar color="stylish-color-dark" dark expand="md">
        <NavbarToggler onClick={props.toggleCollapse} />
        <Collapse isOpen={!props.collapsed} navbar>
            <NavbarNav left>
                <NavItem>
                    <NavLink to="#">Get ID status</NavLink>
                </NavItem>

                <NavItem>
                    <NavLink to="#">Show your ID</NavLink>
                </NavItem>

                <NavItem>
                    <NavLink to="#">Scan an ID</NavLink>
                </NavItem>

                <NavItem>
                    <NavLink to="#">Export your ID</NavLink>
                </NavItem>
            </NavbarNav>
        </Collapse>
    </Navbar>
)

const mapStateToProps = state => {
    return {
        collapsed: state.screenReducer.navigation.collapsed,
        isMobile: state.kuwaReducer.isMobile,
        dropdownSponsors: state.screenReducer.navigation.dropdown.sponsors,
        dropdownRegistrars: state.screenReducer.navigation.dropdown.registrars,
        dropdownFaucets: state.screenReducer.navigation.dropdown.faucets,
        dropdownRegistrationActions: state.screenReducer.navigation.dropdown.registrationActions,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleCollapse: () => {
            dispatch(toggleCollapse("navigation"))
        },
        toggleDropdown: (dropdownName) => {
            dispatch(toggleDropdown("navigation", dropdownName))
        },
        navigateTo: link => {
            dispatch(push(link))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);