import React, { } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, } from 'react-bootstrap'
import ScrollspyNav from "react-scrollspy-nav";



function Header1() {

    return (
        <>
            <div className="header">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="navigation">
                                <Navbar bg="light" expand="lg">
                                    <Link className="navbar-brand" to={'/'}><img src={require('./../../images/logo.png')} alt="" width="75" /></Link>
                                    <img src={require('./../../images/download.png')} alt="" width="225" />
                                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                    <Navbar.Collapse>
                                        <ScrollspyNav
                                            scrollTargetIds={["home", "attributes", "marketplace", "discovery"]}
                                            offset={100}
                                            activeNavclassName="active"
                                            scrollDuration="1000"
                                            headerBackground="true"
                                        >
                                            <Nav className="ml-auto">
                                                <Nav.Item><Nav.Link className="nav-Nav.link" href="#home">Home</Nav.Link></Nav.Item>
                                                <Nav.Item><Nav.Link className="nav-Nav.link" href="#attributes">Attributes </Nav.Link></Nav.Item>
                                                <Nav.Item><Nav.Link className="nav-Nav.link" href="#marketplace">Marketplace </Nav.Link></Nav.Item>
                                                <Nav.Item><Nav.Link className="nav-Nav.link" href="#discovery">Discovered</Nav.Link></Nav.Item>
                                            </Nav>
                                        </ScrollspyNav>

                                    </Navbar.Collapse>

                                    <div className="signin-btn">
                                        <Link className="btn btn-primary ml-3" to={'/dashboard'}>Get Started</Link>
                                    </div>
                                </Navbar>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header1;