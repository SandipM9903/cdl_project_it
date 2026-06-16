import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { set } from 'react-hook-form';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const email = "abhishek_g@cms.co.in"
  const [userData, setUserData] = useState({});

  const fetchUser = () => {
    const empCode = localStorage.getItem("empId");
        const encodedEmpCode = btoa(empCode);
        localStorage.setItem("encodedEmpCode", encodedEmpCode);
    axios.get(` /${email}`)
      .then((res) => {
        setUserData(res.data);
        
      }).catch((err) => {
      console.log(err);
    })
  }

 localStorage.setItem('userData', JSON.stringify(userData));

  const handleLogin = async () => {
    // try {
    //   const response = await axios.get(' https://43.205.24.208:9000/realms/cdl', 
    //     new URLSearchParams({
    //       grant_type: 'password',
    //       client_id: 'cdl_client',
    //       client_secret: 'yreZEcFSdZxFr6iKjssgVcvqX2PhnQlU',
    //       username,
    //       password,
    //       scope: 'openid profile email'
    //     }), 
    //     {
    //       headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //       }
    //     }
    //   );
    //   const accessToken = response.data.access_token;
    //   console.log(accessToken,"accessToken")
    //   localStorage.setItem('accessToken', accessToken);
      alert('Login Success')
      navigate('/userQuiz')
      fetchUser();
    //   onLoginSuccess();
    // } catch (error) {
    //   console.error('Login error:', error);
    // }
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
