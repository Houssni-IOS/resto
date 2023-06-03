import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../pictures/Logo.png';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img src={Logo} alt="Logo" style={{ height: '70px', width: '70px', marginRight: '10px' }} />
          MugiFood
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/ville" className={location.pathname === '/ville' ? 'active' : ''}>
              Ville
            </Nav.Link>
            <Nav.Link as={Link} to="/zone" className={location.pathname === '/zone' ? 'active' : ''}>
              Zone
            </Nav.Link>
            <Nav.Link as={Link} to="/restaurant"className={location.pathname === '/restaurant' ? 'active' : ''}>
              Restaurant
            </Nav.Link>
            <Nav.Link as={Link} to="/maps">
              Maps
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
