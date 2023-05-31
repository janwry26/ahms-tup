import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../utils/http';
import Swal from 'sweetalert2';
import '../styles/login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function SuperAdminLogin({ admin }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (admin) {
      navigate(-1);
    }
  }, [admin, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === '' || password === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No field must be empty',
      });
    } else {
      setIsLoading(true); // Start the loader

      setTimeout(async () => {
        try {
          const res = await http.post('/auth/admin', {
            email,
            password,
          });
          localStorage.setItem('token', res.data);
          window.location = '/dashboard';
        } catch (err) {
          if (err.response && err.response.status === 400) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Invalid email or password',
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
      }, 1500); // 1.5 seconds delay
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
        <h2>Login Form for Admin</h2>
        <form>
          <div className="user-box">
            <input
              required=""
              name=""
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
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
            {passwordVisible ? (
              <FaEyeSlash className="password-toggle" onClick={togglePasswordVisibility} />
            ) : (
              <FaEye className="password-toggle" onClick={togglePasswordVisibility} />
            )}
          </div>
          <center>
            <button className="btnSignin" onClick={handleSubmit}>
              Sign in
            </button>
          </center>
        </form>
      </div>
    </div>
  );
}

export default SuperAdminLogin;
