import React from 'react';
import { toggleDropdown, toggleDrawer } from './actions/screenActions';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import GeneralNavigation from './GeneralNavigation';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';

const requestYourPasscode = [{
    linkName: "REQUEST YOUR PASSCODE",
    link: "http://alpha.kuwa.org:3007/"
}]

/**
 * Shows the navigation bar of The Kuwa Foundation
 * @export
 * @class Navigation
 * @extends React.Component
 */
class Navigation extends React.Component {
    render() {
        if (window.usingCordova) {
            return (
                <div>
                    { mobileAppToolbar(this.props) }
                </div>
            )
        } else {
	    return (
                <GeneralNavigation props={this.props} />
            );
	    // Only pass back the requestYourPasscode link when a passcode is required.
	    /*
            return (
                <GeneralNavigation props={this.props} extraNavigationLinks={requestYourPasscode} />
            );
	    */
        }
    }
}

const mobileAppToolbar = (props) => (
    <AppBar id="mobileNavbar" position="static" style={{backgroundColor: grey[800]}}>
        <Toolbar>

            <Typography variant="title" color="inherit" style={{flexGrow: 1}}>
                {props.toolbarTitle ? props.toolbarTitle : "Demo Site"}
            </Typography>

        </Toolbar>
    </AppBar>
)

const mapStateToProps = state => {
    return {
        toolbarTitle: "Demo Site",
        dropdowns: state.screenReducer.dropdowns,
        drawerOpen: state.screenReducer.drawerOpen
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleDrawer: () => {
            dispatch(toggleDrawer())
        },
        toggleDropdown: (actionName) => {
            dispatch(toggleDropdown(actionName))
        },
        navigateTo: link => {
            dispatch(push(link))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
