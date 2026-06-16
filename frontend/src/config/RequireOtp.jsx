// components/RequireOtp.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireOtp = ({ children }) => {
  const otpVerified = sessionStorage.getItem("otpVerified") === "true";
  return otpVerified ? children : <Navigate to="/" />;
};

export default RequireOtp;
