import React from 'react';
import { Navbar, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact';

export const generalNavigation = (props, extra) => (
    <Navbar color="stylish-color-dark" dark expand="md">
        <NavbarToggler onClick={props.toggleCollapse} />
        <Collapse isOpen={!props.collapsed} navbar>
            <NavbarNav left>
                <NavItem>
                    <NavLink to="/index.html">HOME</NavLink>
                </NavItem>

                <NavItem>
                    <Dropdown isOpen={!props.dropdownSponsors} toggle={() => props.toggleDropdown("sponsors")}>
                    <DropdownToggle nav caret>SPONSORS</DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem href="https://alpha.kuwa.org/sponsor/thelma/">Thelma Sponsor</DropdownItem>
                        <DropdownItem href="http://alpha.kuwa.org:3001/sponsorship_requests">Louise Sponsor</DropdownItem>
                    </DropdownMenu>
                    </Dropdown>
                </NavItem>

                <NavItem>
                    <NavLink to="/client/">CLIENT</NavLink>
                </NavItem>

                <NavItem>
                    <Dropdown isOpen={!props.dropdownRegistrars} toggle={() => props.toggleDropdown("registrars")}>
                    <DropdownToggle nav caret>REGISTRARS</DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem href="https://alpha.kuwa.org/registrar/moe/">Moe Registrar</DropdownItem>
                        <DropdownItem href="https://alpha.kuwa.org/registrar/larry/">Larry Registrar</DropdownItem>
                        <DropdownItem href="https://alpha.kuwa.org/registrar/curly/">Curly Registrar</DropdownItem>
                    </DropdownMenu>
                    </Dropdown>
                </NavItem>

                <NavItem>
                    <Dropdown isOpen={!props.dropdownFaucets} toggle={() => props.toggleDropdown("faucets")}>
                    <DropdownToggle nav caret>FAUCETS</DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem href="https://alpha.kuwa.org/#">Patsy Faucet</DropdownItem>
                        <DropdownItem href="https://alpha.kuwa.org/#">Edina Faucet</DropdownItem>
                    </DropdownMenu>
                    </Dropdown>
                </NavItem>

                <NavItem>
                    <NavLink to="#">DIRECTORY</NavLink>
                </NavItem>

                <NavItem>
                    <NavLink to="/registrations/">REPOSITORY</NavLink>
                </NavItem>

                <NavItem>
                    <NavLink to="/developers/">TEAM</NavLink>
                </NavItem>

                {extra ? extra : null}
            </NavbarNav>
        </Collapse>
    </Navbar>
)