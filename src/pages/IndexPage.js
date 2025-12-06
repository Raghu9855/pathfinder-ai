import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// This component is a simple redirector.
// It checks if a user is logged in and sends them to the
// correct page.
const IndexPage = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If user exists, go to their private dashboard.
  // If not, go to the public login page.
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default IndexPage;