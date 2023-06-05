import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from "../assets/images/hero/hero1.png";
import Hero2 from "../assets/images/hero/hero2.png";
import '../styles/home.css'
import { SlArrowDown,SlArrowUp } from 'react-icons/sl';
function Home() {
  useEffect(() => {
    const button1 = document.getElementById('btn1');
    const button2 = document.getElementById('btn2');
    const button3 = document.getElementById('btn3');
    const page2 = document.getElementById('page2');
    const page3 = document.getElementById('page3');
    const page1 = document.getElementById('page1');

    const handleButton1Click = () => {
      page2.classList.remove('hidden1');
      page2.scrollIntoView({ behavior: 'smooth' });
    };

    const handleButton2Click = () => {
      page3.classList.remove('hidden2');
      page3.scrollIntoView({ behavior: 'smooth' });
    };

    const handleButton3Click = () => {
      page2.classList.add('hidden1');
      page3.classList.add('hidden2');
      page1.scrollIntoView({ behavior: 'smooth' });
    };

    if (button1) button1.addEventListener('click', handleButton1Click);
    if (button2) button2.addEventListener('click', handleButton2Click);
    if (button3) button3.addEventListener('click', handleButton3Click);

    // Clean up event listeners on component unmount
    return () => {
      if (button1) button1.removeEventListener('click', handleButton1Click);
      if (button2) button2.removeEventListener('click', handleButton2Click);
      if (button3) button3.removeEventListener('click', handleButton3Click);
    };
  }, []);

  return (
    <div className="main-container">
      <div id="page1" className="first-container transition">
            <div className='middle'>
              <h1><span>Animal</span>  Healthcare Management System</h1>
              <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
              Lorem Ipsum is simply dummy text. 
              </p>
              <div className='btn-container'>
               <Link to="/login">
                  <button type="button" className="btnLogin">LOGIN</button>
              </Link>
              </div>
            </div>
            <div className='right'>
                <img src={Hero}/>
            </div>
        <button id="btn1"><SlArrowDown  className='first-page-icon'/></button>
      </div>
     
    </div>
   
  );
}

export default Home;
 