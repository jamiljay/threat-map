import React from 'react';
import { connect } from 'react-redux';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink } from 'reactstrap';

import './style.scss';

const ThreatNav = (props) => (
    <Navbar color="dark" light expand="sm">
        <NavbarBrand href="/">Cyber Threats</NavbarBrand>
        <Nav navbar>
            <NavItem>
                <NavLink onClick={()=>{}}>Map</NavLink>
            </NavItem>
            <NavItem>
                <NavLink onClick={()=>{}}>Grid</NavLink>
            </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
            <NavItem>
                <NavLink onClick={()=>{}}>Threats {props.dataCounts.get("total").toLocaleString('en')}</NavLink>
            </NavItem>
        </Nav>
    </Navbar>
);

function mapStateToProps(state) {
    return { 
        dataCounts: state.app.get("dataCounts")
    };
}

export default connect(mapStateToProps)(ThreatNav);