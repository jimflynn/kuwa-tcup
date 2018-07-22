import React from 'react';
import { toggleDropdown, toggleDrawer } from './actions/screenActions';
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
        return (
            generalNavigation(this.props)
        );
    }
}

const mapStateToProps = state => {
    return {
        toolbarTitle: "The Kuwa Foundation",
        dropdowns: state.screenReducer.dropdowns,
        drawerOpen: state.screenReducer.drawerOpen
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleDrawer: () => {
            dispatch(toggleDrawer())
        },
        toggleDropdown: (dropdownName) => {
            dispatch(toggleDropdown(dropdownName))
        },
        navigateTo: link => {
            dispatch(push(link))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);