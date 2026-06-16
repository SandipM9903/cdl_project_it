import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.get(' http://43.205.24.208:9000/realms/cdl', 
        new URLSearchParams({
          grant_type: 'password',
          client_id: 'cdl_client',
          client_secret: 'yreZEcFSdZxFr6iKjssgVcvqX2PhnQlU',
          username,
          password,
          scope: 'openid profile email'
        }), 
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      const accessToken = response.data.access_token;
      localStorage.setItem('accessToken', accessToken);
      onLoginSuccess();
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  

  return (
    <div>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
