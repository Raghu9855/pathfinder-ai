import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import { FaSignOutAlt, FaUserCircle, FaBars } from 'react-icons/fa';

const AppNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobile, setShowMobile] = useState(false);

  const isPublicSharePage = location.pathname.startsWith('/roadmap/share/');
  const logoLink = user ? "/dashboard" : "/login";

  const handleLogout = () => {
    logout();
    setShowMobile(false);
    navigate('/login');
  };

  const closeMenu = () => setShowMobile(false);

  return (
    <>
      <Navbar expand="lg" className="glass-navbar sticky-top">
        <Container>
          {/* Brand */}
          <Navbar.Brand as={Link} to={logoLink} className="brand-logo" onClick={closeMenu}>
            {/* You can add an icon here if you want, e.g. <FaCompass /> */}
            <span className="text-gradient">PathFinder AI</span>
          </Navbar.Brand>

          {/* Desktop Actions (Right Side) */}
          <div className="d-none d-lg-flex order-lg-3 gap-3 align-items-center">
            <ThemeToggle />

            {user ? (
              !isPublicSharePage && (
                <>
                  <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill border" style={{ borderColor: 'var(--border-color)', background: 'var(--background-color)' }}>
                    <FaUserCircle size={18} className="text-primary" />
                    <span className="fw-bold small" style={{ color: 'var(--text-main)' }}>{user.name.split(' ')[0]}</span>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleLogout}
                    className="rounded-pill px-3 fw-bold d-flex align-items-center gap-2"
                    style={{ height: '38px' }}
                  >
                    <FaSignOutAlt /> Logout
                  </Button>
                </>
              )
            ) : (
              <div className="d-flex gap-2">
                <Button as={Link} to="/login" variant="link" className="text-decoration-none text-muted fw-bold">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="primary" className="rounded-pill px-4">
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <Navbar.Toggle
            aria-controls="mobile-nav"
            onClick={() => setShowMobile(true)}
            className="border-0"
          >
            <FaBars size={24} />
          </Navbar.Toggle>

          {/* Desktop Navigation (Center) */}
          <Navbar.Collapse id="desktop-nav" className="d-none d-lg-block">
            <Nav className="mx-auto">
              <Nav.Link as={Link} to="/leaderboard" className="nav-link-custom">Leaderboard</Nav.Link>
              {user && (
                <>
                  <Nav.Link as={Link} to="/roadmaps" className="nav-link-custom">My Library</Nav.Link>
                  <Nav.Link as={Link} to="/mentor" className="nav-link-custom">AI Mentor</Nav.Link>
                  <Nav.Link as={Link} to="/community" className="nav-link-custom">Community</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas Menu (Modern Drawer) */}
      <Offcanvas show={showMobile} onHide={closeMenu} placement="end" style={{ backgroundColor: 'var(--surface-color)', color: 'var(--text-main)' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold text-gradient">Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column gap-4 p-4">
          <Nav className="flex-column gap-3 text-center">
            <Nav.Link as={Link} to="/leaderboard" onClick={closeMenu} className="fs-4 fw-bold text-muted">Leaderboard</Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to="/roadmaps" onClick={closeMenu} className="fs-4 fw-bold text-muted">My Library</Nav.Link>
                <Nav.Link as={Link} to="/mentor" onClick={closeMenu} className="fs-4 fw-bold text-muted">AI Mentor</Nav.Link>
                <Nav.Link as={Link} to="/community" onClick={closeMenu} className="fs-4 fw-bold text-muted">Community</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" onClick={closeMenu} className="fs-4 fw-bold text-muted">Login</Nav.Link>
                <Nav.Link as={Link} to="/register" onClick={closeMenu} className="fs-4 fw-bold text-primary">Register</Nav.Link>
              </>
            )}
          </Nav>

          <div className="mt-auto d-flex flex-column gap-3 align-items-center">
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">Theme</span>
              <ThemeToggle />
            </div>
            {user && (
              <Button variant="danger" onClick={handleLogout} className="w-100 rounded-pill py-2">
                Logout
              </Button>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default AppNavbar;