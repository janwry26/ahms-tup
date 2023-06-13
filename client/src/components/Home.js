import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from "../assets/images/hero/hero1.png";
import '../styles/home.css'
function Home() {

  return (
    <div className="main-container">
      <div id="page1" className="first-container transition">
            <div className='middle'>
              <h1><span>Animal</span>  Healthcare Management System</h1>
              <p>
                Simplify and optimize animal healthcare management with our intuitive system. Task management, medical records, observation report, mortality report, medical history, inventory for medicines, and overall care for pets and animals. Track and monitor their health status effortlessly for timely and effective healthcare delivery.
              </p>
              <div className='btn-container'>
               <Link to="/login">
                  <button type="button" className="btnLogin">LOGIN USER</button>
              </Link>
              <Link to="/zootopia">
                  <button type="button" className="btnLogin">LOGIN ADMIN</button>
              </Link>
              </div>
            </div>
            <div className='right'>
                <img src={Hero}/>
            </div>
      </div>
     
    </div>
   
  );
}

export default Home;
 