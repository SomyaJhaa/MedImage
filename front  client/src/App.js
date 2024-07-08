import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Login from './components/login.component';
import SignUp from './components/signup.component';
import Reset from './components/reset';
import UserDetails from "./components/userDetails";
import DefaultHeader from "./components/defaultHeader";
import UserDetailsHeader from "./components/userDetailsHeader";

import PerformOCR from "./components/PerformOCR";
import ImageOperations from "./components/imageOperations";  // Import the new component

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");

  return (
    <Router>
      <div className="App">
        {/* Conditional rendering of headers */}
        {isLoggedIn === "true" ? <UserDetailsHeader /> : <DefaultHeader />}

        {/* Main Content Area */}
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              {/* Conditional rendering based on isLoggedIn */}
              <Route exact path="/" element={ isLoggedIn === "true" ? <UserDetails /> :  <Login />} />
              <Route path="/sign-in" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/reset" element={<Reset />} />
              <Route path="/userDetails" element={<UserDetails />} />


              <Route path="/perform-ocr/:id" element={<PerformOCR />} />
           </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
