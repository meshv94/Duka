import React from 'react';
import { Navigate } from 'react-router-dom';

const SuperAdminRoute = ({ children }) => {
  // Get admin data from localStorage
  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');

  // Check if user is super admin
  if (adminData.role !== 'super_admin') {
    // Redirect to orders page if not super admin
    return <Navigate to="/orders" replace />;
  }

  // If super admin, render the children
  return children;
};

export default SuperAdminRoute;
