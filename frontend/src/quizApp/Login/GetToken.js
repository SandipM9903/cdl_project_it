import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {jwtDecode} from 'jwt-decode'; // Ensure jwt-decode is installed and imported
import { BASE_URL } from '../../config/Config';

export const GetToken = () => {
  const [token, setToken] = useState(null); // State to hold the token
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [role, setRole] = useState(''); // State to hold the user role
  const email = localStorage.getItem('email'); // Fetch stored email from local storage

  // Effect hook to get auth code from URL params and generate token
  useEffect(() => {
    const authCode = searchParams.get('code');
    if (authCode) {
      console.log('Authorization code received:', authCode);
      generateToken(authCode);
    }
  }, [searchParams]);

  // Function to generate the token from authorization code
  const generateToken = async (authCode) => {
    const clientId = 'microsoft_client';
    const clientSecret = 'v0uMT8arqyqGHSqYi7eke5DzWAGBcg1e'; // Replace with actual client secret
    const tokenUrl = 'https://43.205.24.208:9000/realms/microsoft/protocol/openid-connect/token';
    
    try {
      console.log('Generating token with authorization code:', authCode);
      const response = await axios.post(tokenUrl, new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: authCode,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
   
      if (response.status === 200) {
        const generatedToken = response.data.access_token;
        console.log('Generated Token:', generatedToken);
        // Save the token to local storage
        sessionStorage.setItem('authToken', generatedToken);
        // Set the token in the state
        setToken(generatedToken);

        // Decode the token to extract user info
        const decodedToken = jwtDecode(generatedToken);
        console.log('Decoded Token:', decodedToken);
        const firstName = decodedToken.given_name || "";
        const lastName = decodedToken.family_name || "";
        const email = decodedToken.email || "";

        // Save user info to local storage
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        localStorage.setItem('email', email);

        // Show success alert
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: `Hi ${firstName} ${lastName}`,
        });

        // Fetch employee data and roles based on email
        fetchEmpByEmail(email, generatedToken);
      } else {
        console.error('Unexpected response status:', response.status);
        Swal.fire('Error', 'Token generation failed', 'error');
      }
    } catch (error) {
      handleTokenError(error);
    }
  };

  // Function to handle token generation errors
  const handleTokenError = (error) => {
    let errorMessage = 'An error occurred while generating the token.';
    if (error.response) {
      errorMessage = `Error: ${error.response.status} - ${error.response.data.error_description || error.response.data.error}`;
    } else if (error.request) {
      errorMessage = 'No response received from the server.';
    } else {
      errorMessage = `Error: ${error.message}`;
    }

    Swal.fire({
      icon: 'error',
      title: 'Token Generation Failed',
      text: errorMessage,
    });
  };

  // Function to fetch employee data using email and generated token
  const fetchEmpByEmail = async (email, generatedToken) => {
    try {
      const response = await axios.get(`${BASE_URL}:9020/employee/by/email/${email}`, {
        headers: {
          Authorization: `Bearer ${generatedToken}`,
        },
      });

      const employeeData = response.data;

      if (employeeData.userDTO && Array.isArray(employeeData.userDTO.userRoleResDTOS)) {
        // Mapping role names
        const roleNames = employeeData.userDTO.userRoleResDTOS.map(
          (roleObj) => roleObj.roleResDTO?.name || "Unknown Role"
        );
        console.log("Decoded roles data:", employeeData.userDTO.userRoleResDTOS);
        console.log("Mapped role names:", roleNames);

        // Save the roles to sessionStorage
        sessionStorage.setItem("role", JSON.stringify(roleNames));

        // Navigate based on the roles
        handleRoleBasedNavigation(roleNames);
      } else {
        throw new Error("User roles not found or invalid data structure");
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
      Swal.fire('Error', 'Failed to fetch employee data', 'error');
    }
  };

  // Function to handle navigation based on user roles
  const handleRoleBasedNavigation = (roleNames) => {
    if (Array.isArray(roleNames)) {
      if (roleNames.includes("CMS Employee")) {
        navigate("/HRDashboard");
      } else if (roleNames.includes("USER_EMPLOYEE")) {
        navigate("/Dashboard");
      } else if (roleNames.includes("ADMIN")) {
        navigate("/AdminDashboard");
      } else {
        navigate("/Dashboard");
      }
    } else {
      console.error("roleNames is not an array");
      navigate("/login"); // Redirect to login in case of issues
    }
  };

  return (
    <div>
      <h1>Token Information</h1>
      {token ? (
        <div>
          <button className='bg-green-500' onClick={() => handleRoleBasedNavigation(JSON.parse(sessionStorage.getItem('role')))}>
            Go to Dashboard
          </button>
        </div>
      ) : (
        <p>Generating token, please wait...</p>
      )}
    </div>
  );
};
