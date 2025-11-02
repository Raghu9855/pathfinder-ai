import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
// Import icons for the burger menu
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Add state for mobile nav
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const isPublicSharePage = location.pathname.startsWith('/roadmap/share/');
  const logoLink = user ? "/dashboard" : "/login";

  const handleLogout = () => {
    logout();
    setIsMobileNavOpen(false); // Close mobile nav on logout
    navigate('/login');
  };

  // Helper to close nav on link click
  const handleMobileLinkClick = () => {
    setIsMobileNavOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to={logoLink}>PathFinder AI</Link>
      </div>

      {/* --- 2. Desktop Navigation --- */}
      {/* This section will be hidden on mobile */}
      <div className="navbar-links-desktop">
        <ThemeToggle />
        <Link to="/leaderboard">Leaderboard</Link>
        {user ? (
          <>
            <Link to="/roadmaps">My Roadmaps</Link> 
            <Link to="/mentor">AI Mentor</Link>
            <Link to="/community">Q&A</Link>
            {!isPublicSharePage && (
              <div className="user-info">
                <span className="welcome-text">Welcome, {user.name}</span>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>

      {/* --- 3. Burger Menu Icon --- */}
      {/* This icon is only visible on mobile */}
      <div className="burger-menu" onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}>
        {isMobileNavOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* --- 4. Mobile Navigation Menu --- */}
      {/* This menu slides in/appears when the burger is clicked */}
      <div className={`mobile-nav ${isMobileNavOpen ? 'open' : ''}`}>
        {user ? (
          // --- LOGGED IN MOBILE VIEW ---
          <>
            {!isPublicSharePage && (
              <div className="user-info-mobile">
                <span>Welcome, {user.name}</span>
              </div>
            )}
            <Link to="/leaderboard" onClick={handleMobileLinkClick}>Leaderboard</Link>
            <Link to="/roadmaps" onClick={handleMobileLinkClick}>My Roadmaps</Link> 
            <Link to="/mentor" onClick={handleMobileLinkClick}>AI Mentor</Link>
            <Link to="/community" onClick={handleMobileLinkClick}>Q&A</Link>
            <ThemeToggle />
            <button className="logout-button-mobile" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          // --- LOGGED OUT MOBILE VIEW ---
          <>
            <Link to="/leaderboard" onClick={handleMobileLinkClick}>Leaderboard</Link>
            <Link to="/login" onClick={handleMobileLinkClick}>Login</Link>
            <Link to="/register" onClick={handleMobileLinkClick}>Register</Link>
            <ThemeToggle />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;