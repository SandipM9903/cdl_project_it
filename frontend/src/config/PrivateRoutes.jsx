import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoutes = ({ Component, requiredRoles }) => {
  const location = useLocation();

  const token =
    sessionStorage.getItem('authToken') || sessionStorage.getItem('accessToken');

  let roles = [];
  try {
    roles = JSON.parse(sessionStorage.getItem('role')) || [];
  } catch (e) {
    console.error('Error parsing user roles from sessionStorage:', e);
  }

  const hasRequiredRole = requiredRoles.some((role) => roles.includes(role));

  if (!token) {
    // Redirect to login and pass the original path as query param
    return (
      <Navigate
        to={`/?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Component />;
};

export default PrivateRoutes;
