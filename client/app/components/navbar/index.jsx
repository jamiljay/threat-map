import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem 
} from 'reactstrap';

import './style.scss';

const ThreatNav = (props) => (
    <Navbar color="dark" light expand="sm">
        <NavbarBrand href="/"><i className="fa fa-lg fa-user-secret" aria-hidden="true" /> Cyber Threats</NavbarBrand>
        <Nav navbar>
            <NavItem>
                <Link className="nav-link" to="/">Map</Link>
            </NavItem>
            <NavItem>
                <Link className="nav-link" to="/barchart">Chart</Link>
            </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
            <NavItem title="Total Threats">
                {props.dataCounts.get("total").toLocaleString('en')}
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