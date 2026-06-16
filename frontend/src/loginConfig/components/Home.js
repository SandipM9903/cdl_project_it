// src/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        setToken(accessToken);  // Store the token in the state
        const response = await axios.get('http://43.205.24.208:8500/api/v1/keycloak/test/home', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error fetching message:', error);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <p>Bearer Token: {token}</p>
      <p>Message: {message}</p>
    </div>
  );
};

export default Home;
