import React, { useState, useEffect } from 'react';
import '../styles/login.css';
import http from '../utils/http';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

function Forgot() {


  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  return (
    <div className="login-container">
    
      <div className="login-box">
        <h2>Forgot Password</h2>
        <p className='forgot-message'> Forgot your password?, just input your email and click the forgot password!</p>
        <form>
          <div className="user-box">
            <input
              required=""
              type="text"
            />
            <label>Email</label>
          </div>
          <center>
            <button className="btnSignin" onClick={validation}>
              Forgot Password
            </button>
          </center>
        </form>
      </div>
    </div>
  );
}

export default Forgot;
