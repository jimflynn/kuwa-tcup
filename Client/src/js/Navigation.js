import React from 'react';
import { toggleDropdown, toggleDrawer } from './actions/screenActions';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import GeneralNavigation from './GeneralNavigation';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';
import DotIcon from '@material-ui/icons/Lens';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';

const kuwaActions = [
    {
        actionName: "Get ID status",
        action: () => alert("Not yet implemented")
    },
    {
        actionName: "Show your ID",
        action: () => alert("Not yet implemented")
    },
    {
        actionName: "Scan an ID",
        action: () => alert("Not yet implemented")
    },
    {
        actionName: "Save your ID",
        action: () => alert("Not yet implemented")
    },
    {
        actionName: "Export your ID",
        action: () => alert("Not yet implemented")
    },
]

/**
 * Shows the navigation bar of The Kuwa Foundation
 * @export
 * @class Navigation
 * @extends React.Component
 */
class Navigation extends React.Component {
    render() {
        // return (
        //     <div>
        //         { mobileAppToolbar(this.props) }
        //     </div>
        // )
        if (window.usingCordova) {
            return (
                <div>
                    { mobileAppToolbar(this.props) }
                </div>
            )
        } else {
            return (
                <GeneralNavigation props={this.props} extraNavigationLinks={null} />
            );
        }
    }
}

const mobileAppToolbar = (props) => (
    <AppBar position="static" style={{backgroundColor: grey[800]}}>
        <Toolbar>

            <IconButton onClick={props.toggleDrawer} color="inherit" aria-label="Menu" style={{marginRight: "1em"}}>
                <MenuIcon />
            </IconButton>

            <Typography variant="title" color="inherit" style={{flexGrow: 1}}>
                {props.toolbarTitle ? props.toolbarTitle : "The Kuwa Foundation"}
            </Typography>

            { createMobileToolbar(props, kuwaActions) }

        </Toolbar>
    </AppBar>
)

const createMobileToolbar = (props, kuwaActions) => {
    return (
        <div>
          
          <SwipeableDrawer
            open={props.drawerOpen}
            onClose={props.toggleDrawer}
            onOpen={props.toggleDrawer}
          >
            <div
            //   tabIndex={0}
            //   role="button"
            //   onClick={props.toggleDrawer}
            //   onKeyDown={props.toggleDrawer}
            >
              {drawerContent(props, kuwaActions)}
            </div>
          </SwipeableDrawer>
        </div>
      );
}

const drawerContent = (props, kuwaActions) => (
    <div style={{width: '100%', maxWidth: 360}}>
        <List component="nav">

        {kuwaActions.map((actionItem, index) => {
            if (actionItem.children) {
                return (
                    <div key={(index + 1).toString()}>
                        <ListItem button onClick={() => props.toggleDropdown(actionItem.actionName)}>
                            <ListItemIcon>
                                <DotIcon />
                            </ListItemIcon>
                            <ListItemText inset primary={actionItem.actionName} />
                            {props.dropdowns[actionItem.actionName] ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={props.dropdowns[actionItem.actionName]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {listDropdown(actionItem.children)}
                            </List>
                        </Collapse>
                    </div>
                )
            } else {
                return (
                    <ListItem button key={(index + 1).toString()} color="inherit" onClick={actionItem.action}>
                        <ListItemIcon>
                            <DotIcon />
                        </ListItemIcon>
                        <ListItemText primary={actionItem.actionName} />
                    </ListItem>
                )
            }
        })}

        
        </List>
    </div>
)

const listDropdown = (items) => {
    return (
        items.map((item, index) => {
            return (
                <ListItem key={index + 1} button onClick={item.action} style={{paddingLeft: "2em"}}>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText inset primary={item.actionName} />
                </ListItem>
            )
        })
        
    )
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
        toggleDropdown: (actionName) => {
            dispatch(toggleDropdown(actionName))
        },
        navigateTo: link => {
            dispatch(push(link))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);