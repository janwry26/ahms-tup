import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import http from '../utils/http';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login({ user }) {
  let navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("../dashboard");
    }
  }, [user, navigate]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function validation(e) {
    e.preventDefault();

    if (username === '' || password === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No field must be empty',
      });
    } else {
      setIsLoading(true); // Start the loader

      setTimeout(() => {
        handleSubmit();
      }, 1500);
    }
  }

  const handleSubmit = async () => {
    try {
      const res = await http.post('/auth/user', {
        username,
        password,
      });
      localStorage.setItem('token', res.data);
      window.location = '/dashboard';
    } catch (err) {
      if (err.response && err.response.status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Invalid username or password',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err,
        });
      }
    } finally {
      setIsLoading(false); // Stop the loader
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="login-container">
      {isLoading && (
        <div className="loader-overlayLogin">
          <div className="loaderLogin"></div>
        </div>
      )}
      <div className="login-box">
        <h2>Login form for user</h2>

        <form>
          <div className="user-box">
            <input
              required=""
              name=""
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Username</label>
          </div>
          <div className="user-box">
            <input
              required=""
              name=""
              type={passwordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginBottom: '5px' }}
            />
            <label>Password</label>
            <label>Password</label>
            {passwordVisible ? (
              <FaEyeSlash className="password-toggle" onClick={togglePasswordVisibility} />
            ) : (
              <FaEye className="password-toggle" onClick={togglePasswordVisibility} />
            )}
          </div>
          <center>
            <button className="btnSignin" onClick={validation}>
              Sign in
            </button>
          </center>
        </form>
      </div>
    </div>
  );
}

export default Login;
