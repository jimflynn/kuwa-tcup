import React from 'react';
import { connect } from 'react-redux';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import grey from '@material-ui/core/colors/grey';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

import { toggleCollapse, toggleDropdown } from './actions/screenActions';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';

class SwipeableTemporaryDrawer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            left: false
          };
          this.self = this
    }

    

  render() {

    return (
      <div>
        <AppBar position="static" style={{backgroundColor: grey[800]}}>
            <Toolbar>
            <IconButton onClick={() => toggleDrawer(this.setState.bind(this), true)} color="inherit" aria-label="Menu">
                <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" style={{flexGrow: 1}}>
                The Kuwa Foundation
            </Typography>
            </Toolbar>
        </AppBar>
        
        <SwipeableDrawer
          open={this.state.left}
          onClose={() => toggleDrawer(this.setState.bind(this), false)}
          onOpen={() => toggleDrawer(this.setState.bind(this), true)}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={() => toggleDrawer(this.setState.bind(this), false)}
            onKeyDown={() => toggleDrawer(this.setState.bind(this), false)}
          >
            {myList()}
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

const myList = () => (
    <div style={{width: '100%', maxWidth: 360}}>
      <List component="nav">
        <ListItem button>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="HOME" />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary="SPONSORS" />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary="CLIENT" />
        </ListItem>

        
      </List>
    </div>
)

let toggleDrawer = (setState, open) => {
    setState({
        left: open
    })
  }

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

export default connect(mapStateToProps, mapDispatchToProps)(SwipeableTemporaryDrawer);