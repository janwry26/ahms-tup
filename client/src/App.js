import jwtDecode from 'jwt-decode';
import setAuthToken from "./utils/setAuthToken";

import './App.css';
import Navbar from './components/Navbar.js';
import Routing from "./components/routing/Routing";
import {BrowserRouter} from 'react-router-dom';

let logUser;
if (localStorage.getItem("token")) {
    const jwt = localStorage.getItem("token");
    setAuthToken(jwt);
    logUser = jwtDecode(jwt);
}

let logAdmin;
if (localStorage.getItem("token")) {
    const jwt = localStorage.getItem("token");
    setAuthToken(jwt);
    logAdmin = jwtDecode(jwt);
}

function App() {
  
  const user = logUser;
  const admin = logAdmin;

  user ? console.log("User: ", user) : console.log("Admin: ", admin);
  
  
  return (
    <BrowserRouter>
      <div className='App'>
        <Navbar/>
        <div className='main'>
          <Routing user={user} admin={admin} />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
