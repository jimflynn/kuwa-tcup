import React, { Component } from 'react';
import GeneralNavigation from './GeneralNavigation';

const requestYourPasscode = [{
    linkName: "REQUEST YOUR PASSCODE",
    link: "http://alpha.kuwa.org:3007/"
}]

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toolbarTitle: "Demo Site",
            dropdowns: {},
            drawerOpen: false
        }
        this.toggleDrawer = this.toggleDrawer.bind(this)
        this.toggleDropdown = this.toggleDropdown.bind(this)
        this.newProps = {
            toolbarTitle: this.state.toolbarTitle,
            dropdowns: this.state.dropdowns,
            drawerOpen: this.state.drawerOpen,
            toggleDrawer: this.toggleDrawer,
            toggleDropdown: this.toggleDropdown
        }
    }

    toggleDrawer = () => {
        this.setState({
            drawerOpen: !this.state.drawerOpen
        })
    }

    toggleDropdown = linkName => {
        let currentDropdowns = this.state.dropdowns
        if (currentDropdowns[linkName]) {
            this.setState({
                dropdowns: Object.assign({}, currentDropdowns, {
                    [linkName]: !currentDropdowns[linkName]
                })
            })
        } else {
            this.setState({
                dropdowns: Object.assign({}, currentDropdowns, {
                    [linkName]: true
                })
            })
        }
    }

    render() {
        let extraLinks = null; 
        // Update props before rendering
        this.newProps = Object.assign({}, this.newProps, {
            toolbarTitle: this.state.toolbarTitle,
            dropdowns: this.state.dropdowns,
            drawerOpen: this.state.drawerOpen
        })
	return (
            <GeneralNavigation props={this.newProps}/>
        );
	// Only return the extra link for requesting a passcode if the implementation requires a passcode.
	/*
        return (
            <GeneralNavigation props={this.newProps} extraNavigationLinks={requestYourPasscode} />
        );
	*/
    }
}

export default Navigation;
