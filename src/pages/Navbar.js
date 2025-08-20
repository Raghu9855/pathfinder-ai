import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {AuthContext} from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  console.log('User state in Navbar:', user);
  return (
    <nav>
      <h2 className="logo">
        <Link to="/">PathFinder AI</Link>
      </h2>
      <div className="nav-links">
        {user ?(
          <>
            <span>Welcome, {user.name}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </>
        ): (
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

