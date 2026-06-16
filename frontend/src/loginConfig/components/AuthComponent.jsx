import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Custom hook to parse query parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const TokenFetcher = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const code = query.get('code');
      if (code) {
        try {
          const response = await axios.post('http://43.205.24.208:9000/realms/microsoft/protocol/openid-connect/token', null, {
            params: {
              client_id: 'microsoft_client',
              client_secret: 'voUMT8aryqGHSqYi7eke5DzWAGBcg1e', // Replace with your client secret
              redirect_uri: 'http://43.205.24.208:8500/api/v1/keycloak/test/home',
              grant_type: 'authorization_code',
              code: code,
            },
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });

          const { access_token } = response.data;
          setToken(access_token);

          // Open new tab for validation
          const validationUrl = `http://43.205.24.208:8500/api/v1/keycloak/test/home?token=${access_token}`;
          window.open(validationUrl, '_blank');
        } catch (error) {
          console.error('Error fetching token:', error);
        }
      } else {
        console.error('Authorization code not found');
      }
    };

    fetchToken();
  }, [query]);

  return (
    <div>
      <h1>Token Fetcher</h1>
      {token ? (
        <div>
          <p>Token fetched successfully. Check the new tab for validation.</p>
        </div>
      ) : (
        <p>Fetching token...</p>
      )}
    </div>
  );
};

const AuthComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/api/v1/keycloak/test/home" element={<TokenFetcher />} />
      </Routes>
    </Router>
  );
};

export default AuthComponent;
