// src/hooks/useAuth.js
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password, realm) => {
    setLoading(true);
    setError(null);

    const realmConfig = {
      cdl: {
        url: 'http://43.205.24.208:9000/realms/cdl/protocol/openid-connect/token',
        client_id: 'cdl_client',
        client_secret: 'yreZEcFSdZxFr6iKjssgVcvqX2PhnQlU',
      },
      microsoft: {
        url: 'https://login.microsoftonline.com/1b20657f-0ef8-4b71-befd-86770efa7aff/oauth2/v2.0/token',
        client_id: '4b259fc3-8b28-4abf-becc-ceb30bb8f870',
        client_secret: 'zDl8Q~W1w8alhkcXtral0Oy8PuIl4MGfUXtJqabs',
      },
      // Add other realms here if needed
    };

    const config = realmConfig[realm];

    if (!config) {
      setError('Invalid realm');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        config.url,
        new URLSearchParams({
          grant_type: 'password',
          client_id: config.client_id,
          client_secret: config.client_secret,
          username,
          password,
          scope: 'openid',
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const userData = response.data;
      localStorage.setItem('accessToken', userData.access_token);
      localStorage.setItem('refreshToken', userData.refresh_token);
      setUser(userData);
      toast.success('Login successful!');
      
    } catch (err) {
      setError('Login failed: ' + err.message);
      toast.error('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, login };
};

export default useAuth;
