import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import grey from '@material-ui/core/colors/grey';

const sponsorsLinks = [
    {
        linkName: "Thelma Sponsor",
        link: "https://alpha.kuwa.org/sponsor/thelma/"
    },
    {
        linkName: "Louise Sponsor",
        link: "http://alpha.kuwa.org:3001/sponsorship_requests"
    }
]

const registrarsLinks = [
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

const faucetsLinks = [
    {
        linkName: "Patsy Faucet",
        link: "https://alpha.kuwa.org/#"
    },
    {
        linkName: "Edina Faucet",
        link: "https://alpha.kuwa.org/#"
    }
]

const homeLink = "https://alpha.kuwa.org/index.html";
const clientLink = "https://alpha.kuwa.org/client/";
const directoryLink = "http://alpha.kuwa.org:3011/";
const repositoryLink = "https://alpha.kuwa.org/registrations/";
const teamLink = "https://alpha.kuwa.org/developers/";

export const generalNavigation = (props) => (
    <div style={{flexGrow: 1}}>
        <AppBar position="static" style={{backgroundColor: grey[800]}}>
            <Toolbar>
                <Typography variant="title" color="inherit" style={{flexGrow: 1}}>
                    The Kuwa Foundation
                </Typography>

                <Button color="inherit" onClick={() => location.href = homeLink}>HOME</Button>

                <Button id="sponsors" onClick={() => props.toggleDropdown("sponsors")} color="inherit">SPONSORS</Button>
                {menuDropdown(props, props.dropdownSponsors, "sponsors", sponsorsLinks)}

                <Button color="inherit" onClick={() => location.href = clientLink}>CLIENT</Button>

                <Button id="registrars" onClick={() => props.toggleDropdown("registrars")} color="inherit">REGISTRARS</Button>
                {menuDropdown(props, props.dropdownRegistrars, "registrars", registrarsLinks)}

                <Button id="faucets" onClick={() => props.toggleDropdown("faucets")} color="inherit">FAUCETS</Button>
                {menuDropdown(props, props.dropdownFaucets, "faucets", faucetsLinks)}

                <Button color="inherit" onClick={() => location.href = directoryLink}>DIRECTORY</Button>

                <Button color="inherit" onClick={() => location.href = repositoryLink}>REPOSITORY</Button>

                <Button color="inherit" onClick={() => location.href = teamLink}>TEAM</Button>

            </Toolbar>
        </AppBar>
    </div>
)

const menuDropdown = (props, isClosed, anchorElement, items) => (
    <Menu
        anchorEl={document.querySelector("#" + anchorElement)}
        open={!isClosed}
        onClose={() => props.toggleDropdown(anchorElement)}
    >
        {items.map((item, index) => {
            return (
                <MenuItem key={(index + 1).toString()} onClick={() => {
                    props.toggleDropdown(anchorElement)
                    location.href = item.link
                }}>{item.linkName}</MenuItem>    
            )
        })}
    </Menu>
)