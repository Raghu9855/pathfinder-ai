import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// 1. Fixed import path (added ../)
import { AuthContext } from '../../../context/AuthContext';
// 2. Fixed import path (added ../)


const ProtectedRoute = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // If not logged in, redirect to the login page
    // 'replace' stops them from using the "back" button to see the protected page
    return <Navigate to="/login" replace />;
  }

  // If logged in, show the Navbar and the protected page
  return <Outlet />;
};

export default ProtectedRoute;