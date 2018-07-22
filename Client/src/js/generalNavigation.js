import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import grey from '@material-ui/core/colors/grey';

const originalNavigationLinks = [
    {
        linkName: "HOME",
        link: "https://alpha.kuwa.org/index.html"
    },
    {
        linkName: "SPONSORS",
        children: [
            {
                linkName: "Thelma Sponsor",
                link: "https://alpha.kuwa.org/sponsor/thelma/"
            },
            {
                linkName: "Louise Sponsor",
                link: "http://alpha.kuwa.org:3001/sponsorship_requests"
            }
        ]
    },
    {
        linkName: "CLIENT",
        link: "https://alpha.kuwa.org/client/"
    },
    {
        linkName: "REGISTRARS",
        children: [
            {
                linkName: "Moe Registrar",
                link: "https://alpha.kuwa.org/registrar/moe/"
            },
            {
                linkName: "Larry Registrar",
                link: "https://alpha.kuwa.org/registrar/larry/"
            },
            {
                linkName: "Curly Registrar",
                link: "https://alpha.kuwa.org/registrar/curly/"
            }
        ]
    },
    {
        linkName: "FAUCETS",
        children: [
            {
                linkName: "Patsy Faucet",
                link: "https://alpha.kuwa.org/#"
            },
            {
                linkName: "Edina Faucet",
                link: "https://alpha.kuwa.org/#"
            }
        ]
    },
    {
        linkName: "DIRECTORY",
        link: "http://alpha.kuwa.org:3011/"
    },
    {
        linkName: "REPOSITORY",
        link: "https://alpha.kuwa.org/registrations/"
    },
    {
        linkName: "TEAM",
        link: "https://alpha.kuwa.org/developers/"
    },
]

export const generalNavigation = (props, extraNavigationLinks) => {
    let newNavigationLinks = extraNavigationLinks ? originalNavigationLinks.concat(extraNavigationLinks) : originalNavigationLinks;
    return (
        <div style={{flexGrow: 1}}>
            <AppBar position="static" style={{backgroundColor: grey[800]}}>
                <Toolbar>
                    <Typography variant="title" color="inherit" style={{flexGrow: 1}}>
                        The Kuwa Foundation
                    </Typography>

                    {createDesktopToolbar(props, newNavigationLinks)}

                </Toolbar>
            </AppBar>
        </div>
    )
}

const createDesktopToolbar = (props, navigationLinks) => (
    navigationLinks.map((navItem, index) => {
        if (navItem.children) {
            return (
                <div key={(index + 1).toString()}>
                    <Button id={navItem.linkName} onClick={() => props.toggleDropdown(navItem.linkName)} color="inherit">{navItem.linkName}</Button>
                    {menuDropdown(props, props.dropdowns[navItem.linkName], navItem.linkName, navItem.children)}
                </div>
            )
        } else {
            return (
                <Button key={(index + 1).toString()} color="inherit" onClick={() => {
                    if (navItem.link) 
                        location.href = navItem.link
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
                        location.href = item.link
                    else if (item.pushLink)
                        props.navigateTo('/' + item.pushLink)
                }}>{item.linkName}</MenuItem>    
            )
        })}
    </Menu>
)