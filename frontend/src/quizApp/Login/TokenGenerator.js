/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';

const TokenGenerator = () => {
  const [clientId, setClientId] = useState('microsoft_client');
  const [clientSecret, setClientSecret] = useState('v0uMT8arqyqGHSqYi7eke5DzWAGBcg1e'); // Replace with actual client secret
  const [authUrl, setAuthUrl] = useState('https://43.205.24.208:9000/realms/microsoft/protocol/openid-connect/auth');
  const [tokenUrl, setTokenUrl] = useState('https://43.205.24.208:9000/realms/microsoft/protocol/openid-connect/token');
  const [redirectUri, setRedirectUri] = useState('http://43.205.24.208:8500/api/v1/keycloak/test/home');
  const [code, setCode] = useState('');

  const generateToken = async () => {
    try {
      const response = await axios.post(tokenUrl, {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri, 
        grant_type: 'authorization_code',
        code,
      });

      const token = response.data.access_token;
      console.log('Generated Token:', token);

      // Open a new tab for validation
      const validationUrl = `http://43.205.24.208:8500/api/v1/keycloak/test/home?token=${token}`;
      window.open(validationUrl, '_blank');
    } catch (error) {
      console.error('Error generating token:', error);
    }
  };

  const handleAuth = () => {
    const url = `${authUrl}?client_id=${clientId}`;
    window.open(url, '_blank', 'width=500,height=500');
  };

  const handleCodeInput = (event) => {
    setCode(event.target.value);
  };

  return (
    <div>
      <h1>Token Generator</h1>
      <button onClick={handleAuth}>Authorize</button>
      <div>
        <input
          type="text"
          value={code}
          onChange={handleCodeInput}
          placeholder="Enter authorization code"
        />
        <button onClick={generateToken}>Generate Token</button>
      </div>
    </div>
  );
};

export default TokenGenerator;
