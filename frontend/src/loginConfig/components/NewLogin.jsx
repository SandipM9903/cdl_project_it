import React, { useState } from 'react';
import axios from 'axios';

const NewLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'https://cors-anywhere.herokuapp.com/https://login.microsoftonline.com/1b20657f-0ef8-4b71-befd-86770efa7aff/oauth2/v2.0/token',
        new URLSearchParams({
          grant_type: 'password',
          client_id: '4b259fc3-8b28-4abf-becc-ceb30bb8f870',
          client_secret: 'zDl8Q~W1w8alhkcXtral0Oy8PuIl4MGfUXtJqabs',
          username,
          password,
          scope: 'openid'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      const accessToken = response.data.access_token;
      setToken(accessToken);
      localStorage.setItem('accessToken', accessToken);
      console.log('Login successful, token:', accessToken);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleIntrospect = async () => {
    try {
      const introspectResponse = await axios.post(
        '/api/realms/microsoft/protocol/openid-connect/token/introspect',
        new URLSearchParams({
          token: token,
          client_id: 'microsoft_client',
          client_secret: 'vOuMT8arqyqGHSqYi7eke5DzWAGBcg1e'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      console.log('Introspect response:', introspectResponse.data);
    } catch (error) {
      console.error('Introspect error:', error);
    }
  };
  // ...

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
      {token && (
        <div>
          <h3>Token:</h3>
          <p>{token}</p>
          <button onClick={handleIntrospect}>Introspect Token</button>
        </div>
      )}
    </div>
  );
};

export default NewLogin;
