import React from 'react';
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
        return (
            generalNavigation(this.props)
        );
    }
}

const mapStateToProps = state => {
    return {
        collapsed: state.screenReducer.navigation.collapsed,
        dropdowns: state.screenReducer.dropdowns
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleCollapse: () => {
            dispatch(toggleCollapse("navigation"))
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