import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
      e.preventDefault();
  
      // Clear previous error message
      setErrorMessage('');
  
      // API call to authenticate and get access token
      try {
        const response = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Network response was not ok');
        }
  
        const data = await response.json();
        const { accessToken } = data;
  
        if (accessToken) {
          localStorage.setItem('auth', 'true');
          localStorage.setItem('token', accessToken);
          navigate('/');
        } else {
          setErrorMessage('Username or password is wrong');
        }
      } catch (error) {
        console.error('Error during login:', error);
        setErrorMessage('System error');
      }
    };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="w-25 card p-4">
        <h2 className="text-center">Login</h2>
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleLogin} className="d-flex flex-column">
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
