import React, { useState, useEffect } from 'react';
import '../styles/login.css';
import http from '../utils/http';
import Swal from 'sweetalert2';

function ChangePass() {

  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');

  const validation = async () => {
    if (password === confirmpassword) {
      await http.get(`/api/admin/change-pass`,{
        password
      })
      .then((res) => {
        console.log(res);
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Passwords do not match',
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
