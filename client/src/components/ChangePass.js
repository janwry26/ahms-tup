import React, { useState, useEffect } from 'react';
import '../styles/login.css';
import http from '../utils/http';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';

function ChangePass() {

  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  let email = localStorage.getItem('email');
  const queryParams = new URLSearchParams(location.search);
  let account_type = queryParams.get('account_type');

  useEffect(() => {
    // Do something with the paramValue
    console.log(account_type);
  }, [location.search]);

  const validation = async (e) => {
    e.preventDefault();
    if (password === confirmpassword) {
      await http.put(`/${account_type}/change-password/${email}`,{
        password
      })
      .then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Successfully changed password',
        })
        .then(() => account_type == 'user' ? navigate('/login') : navigate('/zootopia'));
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Passwords do not match',
      })
    }
  }

  return (
    <div className="login-container">
    
      <div className="login-box">
        <h2>Change Password</h2>
        <form>
          <div className="user-box">
            <input
              required={true}
              type="password"
              id='passwordInp'
              name='passwordInp'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <label>New Password</label>
          </div>
          <div className="user-box">
            <input
              required={true}
              type="password"
              id='confirmpasswordInp'
              name='confirmpasswordInp'
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmpassword}
            />
            <label>Confirm Password</label>
          </div>
          <center>
            <button className="btnSignin" onClick={validation}>
              Change Password
            </button>
          </center>
        </form>
      </div>
    </div>
  );
}

export default ChangePass;
