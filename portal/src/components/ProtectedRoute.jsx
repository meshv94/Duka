import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  const adminData = localStorage.getItem('adminData');

  // Check if user is authenticated
  if (!token || !adminData) {
    // Redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Check if admin is active (optional additional check)
  try {
    const admin = JSON.parse(adminData);
    if (admin.isBlocked) {
      // Clear storage and redirect to login
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error('Error parsing admin data:', error);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render children
  return children;
};

export default ProtectedRoute;
