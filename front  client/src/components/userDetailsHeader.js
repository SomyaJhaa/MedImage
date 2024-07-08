import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function UserDetailsHeader({ userdata, logout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
      <div className="container">
        <Link className="navbar-brand" to={'/'}>
          MedImage
        </Link>
        {/* Move user info and logout button to the left */}
        <div className="d-flex align-items-center ml-auto">
          <div className="dropdown" ref={dropdownRef}>
            {/* Dropdown toggle */}
            <span
              className="nav-link dropdown-toggle"
              onClick={toggleDropdown}
              style={{ cursor: 'pointer' }}
            >
              Logged in as {userdata && userdata.fname}
            </span>
            {/* Dropdown menu */}
            <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
              <p className="dropdown-item-text mb-0">
                {userdata && userdata.email}
              </p>
            </div>
          </div>
          {/* logout button */}
          <button onClick={logout} className="btn btn-primary ml-3">
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default UserDetailsHeader;
