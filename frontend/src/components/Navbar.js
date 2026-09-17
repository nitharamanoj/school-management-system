import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">🎓</span>
        <span>Student Management System</span>
      </Link>
      <div className="navbar-links">
        <Link
          to="/"
          id="nav-dashboard"
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          📋 Dashboard
        </Link>
        <Link
          to="/add"
          id="nav-add-student"
          className={`nav-link ${location.pathname === '/add' ? 'active' : ''}`}
        >
          ➕ Add Student
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
