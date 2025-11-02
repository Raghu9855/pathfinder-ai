import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // This check is to hide user info on public share pages
  const isPublicSharePage = location.pathname.startsWith('/roadmap/share/');

  // If the user is logged in, the logo takes them to their dashboard (search page).
  // If logged out, it takes them to the login page.
  const logoLink = user ? "/dashboard" : "/login";

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to={logoLink}>PathFinder AI</Link>
      </div>

      <div className="navbar-links">
        <ThemeToggle />
        <Link to="/leaderboard">Leaderboard</Link>

        {user ? (
          // --- LOGGED IN VIEW ---
          <>
            {/* --- THIS IS THE FIX --- */}
            <Link to="/roadmaps">My Roadmaps</Link> 
            
            <Link to="/mentor">AI Mentor</Link>

            <Link to="/community">Q&A</Link>
            
            {/* This will ONLY be hidden if we are on the public share page */}
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
          // --- LOGGED OUT VIEW (or on public share page) ---
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;