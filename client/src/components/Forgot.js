import React, { useState, useEffect } from 'react';
import '../styles/login.css';
import http from '../utils/http';
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com';
import { useNavigate } from "react-router-dom";

function Forgot() {

  const [email, setEmail] = useState('');
  let userType;
  const [isLoading, setIsLoading] = useState(false);
  const systemName = "AHMS";

  const navigate = useNavigate();

  const checkEmail = async (submitted_email) => {
    try {
      const userResponse = await http.get(`/user/view-email/${submitted_email}`);
      const adminResponse = await http.get(`/admin/view-email/${submitted_email}`);
      if (userResponse.data != 'User not found' || adminResponse.data != 'User not found') {
        userResponse.data != 'User not found' ? userType = 'user' : userType = 'admin';
        return true;
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Email not found',
          showConfirmButton: false
        });
        return false;
      }
    } catch (error) {
      console.error('Error occurred while checking email:', error);
      return false;
    }
  };
  

  const validation = async (e) => {
    e.preventDefault();
    let trimmed = email.trim();
    
    // Regular expression pattern for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (trimmed === "") {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please provide a valid email address',
      });
    } else if (!emailRegex.test(trimmed)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please provide a valid email address',
      });
    } else {
      await checkEmail(trimmed)
      .then((res) => {
        if (res) {
          processEmail(trimmed);
        }
      })
    }
  }

  const processEmail = async (submitted_email) => {
    let code = generate_code();
    var email_data = {
      "reciever_email": submitted_email,
      "system_name": systemName,
      "reset_code": code
    }

    await sendEmail(email_data);

    Swal.fire({
      title: 'Reset code was sent to your email address',
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      html: `
        <div>
          <input id="resetCodeInput" class="swal2-input" style="margin-bottom: 10px; placeholder='Enter Reset Code'">
        </div>
        <div>
          <button id="cancelButton" class="swal2-cancel swal2-styled">Cancel</button>
          <button id="submitButton" class="swal2-confirm swal2-styled">Submit</button>
        </div>
      `,
      didOpen: () => {
        const cancelButton = Swal.getPopup().querySelector('#cancelButton');
        const submitButton = Swal.getPopup().querySelector('#submitButton');
        const resetCodeInput = Swal.getPopup().querySelector('#resetCodeInput');
    
        cancelButton.addEventListener('click', () => {
          Swal.close();
        });
    
        submitButton.addEventListener('click', async () => {
          const submitted_code = resetCodeInput.value;
          
          if (submitted_code === code) {
            localStorage.setItem('email', submitted_email);
            Swal.fire({
              icon: 'success',
              title: 'Reset Code Confirmed',
              timer: 1500
            }).then(() => {
              navigate(`/change-pass?account_type=${userType}`);
            });
          } else {
            Swal.showValidationMessage('Invalid reset code');
          }
        });
      }
    });
    
    
              
    
  }

  function sendEmail(emailParams) {
    emailjs.send('ahms_server', 'ahms_forgot_password', emailParams, 'BwZ_bncOp4Uto8vK9')
      .catch((error) => {
          console.log(error.text);
      });
  }
  function generate_code() {
    // Generate a random number between 0 and 1
    let randomNumber = Math.random();
    // Convert the number to a string and extract the first 6 digits
    let confirmationCode = randomNumber.toString().substring(2, 8);
    return confirmationCode;
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
              type="email"
              id='emailInp'
              name='emailInp'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
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
