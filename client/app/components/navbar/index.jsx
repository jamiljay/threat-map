import React from 'react';
import { connect } from 'react-redux';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

import * as Actions from '../../store/actions';


import './style.scss';

class ThreatNav extends React.Component {
    constructor(props) {
      super(props);
  
      this.toggle = this.toggle.bind(this);
      this.state = {
        isOpen: false
      };
    }
    toggle() {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
    render () {

        return (
            <Navbar color="dark" light expand="sm">
                <NavbarBrand href="/">Cyber Threat App</NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav navbar>
                        <NavItem>
                            <NavLink onClick={()=>{}}>Map</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink onClick={()=>{}}>Grid</NavLink>
                        </NavItem>
                    </Nav>
                    <Nav className="ml-auto" navbar>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                            Viruses
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem>
                                    Trojans: 1
                                </DropdownItem>
                                <DropdownItem>
                                    Bots: 2
                                </DropdownItem>
                                <DropdownItem>
                                    Spam: 3
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem>
                                    All: 6
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}

function mapStateToProps(state) {
    return { threats: state.app.get("threats").toJS() }
}


function mapDispatchToProps(dispatch){
    return {
        update: threats=>dispatch(Actions.update(threats)),
        load: ()=>dispatch(Actions.load())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreatNav);