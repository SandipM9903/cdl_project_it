
// src/AppContent.js
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './Home';
import './AppContent.css'; // Import custom CSS for styling
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import { BASE_URL } from '../../config/Config';

const AppContent = () => {
  const { user, loading, error, login } = useAuth();
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [realm, setRealm] = useState("cdl");

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password, realm);
    
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.reload();
  };

  const handleCallApi = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      const response = await axios.get(`${BASE_URL}:8500/api/v1/keycloak/test/home`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setMessage(response.data.message);
      toast.success('API returned successfully. Check the home page.');
    } catch (error) {
      toast.error('Failed to fetch API: ' + error.message);
    }
  };

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;

        const response = await axios.get('http://43.205.24.208:8500/api/v1/keycloak/test/home', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setMessage(response.data.message);
      } catch (error) {
        toast.error('Failed to fetch message: ' + error.message);
      }
    };

    if (user) {
      fetchMessage();
    }
  }, [user]);

  return (
    <>
      <ToastContainer />
      {!user ? (
        <div className="login-container">
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Login</h2>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <div className="form-group">
              <label>Realm</label>
              <select
                className="form-control"
                value={realm}
                onChange={(e) => setRealm(e.target.value)}
                required
              >
                <option value="cdl">CDL</option>
                <option value="microsoft">Microsoft</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p className="text-danger mt-2">{error}</p>}
          </form>
        </div>
      ) : (
        <>
          <div className="button-container">
            <button className="btn btn-primary" onClick={handleCallApi}>
              Get Backend
            </button>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
          {message && <Home message={message} />}
        </>
      )}
    </>
  );
};

export default AppContent;
