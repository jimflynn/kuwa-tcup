import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
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

import withWidth from '@material-ui/core/withWidth';

const originalNavigationLinks = [
    {
        linkName: "TCUP HOME",
        link: "https://alpha.kuwa.org/index.html?page_section=demo"
    },
    {
        linkName: "SPONSOR",
        link: "http://alpha.kuwa.org:3001/sponsorship_requests"
    },
    {
        linkName: "CLIENT",
        link: "https://alpha.kuwa.org/client/"
    },
    {
        linkName: "REGISTRAR",
        link: "http://alpha.kuwa.org:3005"
    },
    {
        linkName: "FAUCET",
        link: "http://alpha.kuwa.org:3015/"
    },
    {
        linkName: "DIRECTORY",
        link: "http://alpha.kuwa.org:3011/"
    },
]

class GeneralNavigation extends Component {
    render() {
        let newNavigationLinks = this.props.extraNavigationLinks ? originalNavigationLinks.concat(this.props.extraNavigationLinks) : originalNavigationLinks;
        let props = this.props.props;
        //console.log(props);
        return (
                <AppBar position="static" style={{backgroundColor: grey[800]}}>
                    <Toolbar>

                        {this.props.width === 'xs' || this.props.width === 'sm' || this.props.width === 'md' ? 
                            <IconButton onClick={props.toggleDrawer} color="inherit" aria-label="Menu" style={{marginRight: "1em"}}>
                                <MenuIcon />
                            </IconButton>
                        :
                            null
                        }
                        <Typography variant="title" color="inherit" style={{flexGrow: 1}}>
                            {props.toolbarTitle ? props.toolbarTitle : ""}
                        </Typography>

                        {this.props.width === 'xs' || this.props.width === 'sm' || this.props.width === 'md' ? 
                            createMobileToolbar(props, newNavigationLinks)
                        :
                            createDesktopToolbar(props, newNavigationLinks)
                        }
                    </Toolbar>
                </AppBar>
        )
    }
    
}

const createDesktopToolbar = (props, navigationLinks) => (
    navigationLinks.map((navItem, index) => {
        console.log(props);
        if (navItem.children) {
            return (
                <div key={(index + 1).toString()}>
                    <Button id={navItem.linkName} onClick={() => props.toggleDropdown(navItem.linkName)} color="inherit">{navItem.linkName}</Button>
                    {menuDropdown(props, props.dropdowns[navItem.linkName], navItem.linkName, navItem.children)}
                </div>
            )
            // return null
        } else {
            return (
                <Button key={(index + 1).toString()} color="inherit" onClick={() => {
                    if (navItem.link) 
                        window.location.href = navItem.link
                    else if (navItem.pushLink)
                        props.navigateTo('/' + navItem.pushLink)
                }}>{navItem.linkName}</Button>
            )
        }
    })
)

const menuDropdown = (props, isOpen, anchorElement, items) => (
    <Menu
        anchorEl={document.querySelector("#" + anchorElement)}
        open={isOpen ? true : false}
        onClose={() => props.toggleDropdown(anchorElement)}
    >
        {items.map((item, index) => {
            return (
                <MenuItem key={(index + 1).toString()} onClick={() => {
                    props.toggleDropdown(anchorElement)
                    if (item.link) 
                        window.location.href = item.link
                    else if (item.pushLink)
                        props.navigateTo('/' + item.pushLink)
                }}>{item.linkName}</MenuItem>    
            )
        })}
    </Menu>
)

const createMobileToolbar = (props, navigationLinks) => {
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
              {drawerContent(props, navigationLinks)}
            </div>
          </SwipeableDrawer>
        </div>
      );
}

const drawerContent = (props, navigationLinks) => (
    <div style={{width: '100%', maxWidth: 360}}>
        <List component="nav">
        {navigationLinks.map((navItem, index) => {
            if (navItem.children) {
                return (
                    <div key={(index + 1).toString()}>
                        <ListItem button onClick={() => props.toggleDropdown(navItem.linkName)}>
                            <ListItemIcon>
                                <DotIcon />
                            </ListItemIcon>
                            <ListItemText inset primary={navItem.linkName} />
                            {props.dropdowns[navItem.linkName] ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={props.dropdowns[navItem.linkName]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {listDropdown(props, navItem.children)}
                            </List>
                        </Collapse>
                    </div>
                )
            } else {
                return (
                    <ListItem button key={(index + 1).toString()} color="inherit" onClick={() => {
                        if (navItem.link) 
                            window.location.href = navItem.link
                        else if (navItem.pushLink)
                            props.navigateTo('/' + navItem.pushLink)
                    }}>
                        <ListItemIcon>
                            <DotIcon />
                        </ListItemIcon>
                        <ListItemText primary={navItem.linkName} />
                    </ListItem>
                )
            }
        })}

        
        </List>
    </div>
)

const listDropdown = (props, items) => {
    return (
        items.map((item, index) => {
            return (
                <ListItem key={index + 1} button onClick={() => {
                    if (item.link) 
                        window.location.href = item.link
                    else if (item.pushLink)
                        props.navigateTo('/' + item.pushLink)
                }} style={{paddingLeft: "2em"}}>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText inset primary={item.linkName} />
                </ListItem>
            )
        })
        
    )
}

export default withWidth()(GeneralNavigation)
