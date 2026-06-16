import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { BASE_URL } from '../../config/Config';

export const GetToken = () => {
  const [token, setToken] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirect = searchParams.get("redirect") || null;

  useEffect(() => {
    const authCode = searchParams.get('code');
    if (authCode) {
      generateToken(authCode);
    }
  }, [searchParams]);

  const generateToken = async (authCode) => {
    const clientId = 'microsoft_client';
    const clientSecret = 'v0uMT8arqyqGHSqYi7eke5DzWAGBcg1e'; // Replace with ENV var in production
    const tokenUrl = 'https://43.205.24.208:9000/realms/microsoft/protocol/openid-connect/token';

    try {
      const response = await axios.post(tokenUrl, new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: window.location.origin + "/get-token", // Must match Keycloak redirect URI
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.status === 200) {
        const generatedToken = response.data.access_token;
        setToken(generatedToken);
        sessionStorage.setItem('authToken', generatedToken);
        sessionStorage.setItem('accessToken', generatedToken);

        const decodedToken = jwtDecode(generatedToken);
        const { given_name, family_name, email } = decodedToken;

        localStorage.setItem('firstName', given_name || "");
        localStorage.setItem('lastName', family_name || "");
        localStorage.setItem('email', email || "");

        fetchEmpByEmail(email, generatedToken);
      } else {
        console.error('Token response error:', response.status);
      }
    } catch (error) {
      handleTokenError(error);
    }
  };

  const handleTokenError = (error) => {
    let errorMessage = 'An error occurred while generating the token.';
    if (error.response) {
      errorMessage = `Error: ${error.response.status} - ${error.response.data.error_description || error.response.data.error}`;
    } else if (error.request) {
      errorMessage = 'No response received from the server.';
    } else {
      errorMessage = `Error: ${error.message}`;
    }
    console.error(errorMessage);
  };

  const fetchEmpByEmail = async (email, generatedToken) => {
    try {
      const response = await axios.get(`${BASE_URL}:9020/employee/by/email/${email}`, {
        headers: {
          Authorization: `Bearer ${generatedToken}`,
        },
      });

      const emp = response.data?.fileAndObjectTypeBean?.empResDTO || {};
      const userDTO = response.data?.userDTO;

      const rolesArray = userDTO?.userRoleResDTOS || [];
      const roleNames = rolesArray.map(role => role?.roleResDTO?.name || "Unknown Role");

      const locationId = userDTO?.locationResDTO?.locationId;
      const empId = emp?.empCode || "";
      const profileImage = emp?.profileImage || "default_profile.png";
      const employeeName = emp?.firstName || "User";
      const contactNumber = emp?.primaryContactNo || "N/A";

      sessionStorage.setItem("role", JSON.stringify(roleNames));
      sessionStorage.setItem("locationId", locationId);
      sessionStorage.setItem("primaryContactNo", contactNumber);
      
      localStorage.setItem("EmployeeName", employeeName);
      localStorage.setItem("ProfileImage", profileImage);
      localStorage.setItem("empId", empId);

      handleRoleBasedNavigation(roleNames);
    } catch (error) {
      console.error("Failed to fetch employee data:", error);
    }
  };

  const handleRoleBasedNavigation = (roleNames) => {
    let destination = redirect || "/select-mood";

    // Example custom routes based on roles
    if (roleNames.includes("ADMIN")) {
      destination = redirect || "/admin/dashboard";
    } else if (roleNames.includes("CMS Employee")) {
      destination = redirect || "/select-mood";
    }

    navigate(destination);
    window.history.replaceState(null, '', destination); // Clean up URL
  };

  return (
    <div className='min-h-[calc(100vh-64px)] flex flex-col items-center justify-center'>
      <h1 className='text-2xl font-bold mb-4'>Logging In...</h1>
      {token ? (
        <button
          className='bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700'
          onClick={() => handleRoleBasedNavigation(JSON.parse(sessionStorage.getItem('role')))}
        >
          Go to Dashboard
        </button>
      ) : (
        <p className='text-gray-600'>Generating token, please wait...</p>
      )}
    </div>
  );
};









