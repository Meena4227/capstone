import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isPatient, isDoctor } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="main-navbar">
      <Link to="/" className="logo">
        🩺 <span>TeleCare</span>
      </Link>

      <nav>
        <Link to="/#features">Features</Link>
        <Link to="/#how">How it works</Link>
        <Link to="/doctors">Find Doctors</Link>

        {user ? (
          <div className="nav-auth-group">
            {isPatient && (
              <Link to="/patient-dashboard" className="nav-dash-link">
                👤 Patient Dashboard
              </Link>
            )}
            {isDoctor && (
              <Link to="/doctor-dashboard" className="doctor-btn">
                👨‍⚕️ Doctor Dashboard →
              </Link>
            )}
            <span className="nav-user-pill">
              {user.avatar || '👤'} {user.name}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        ) : (
          <div className="nav-guest-group">
            <Link to="/login" className="login-btn">
              Patient Login
            </Link>
            <Link to="/doctor-login" className="doctor-home-btn">
              👨‍⚕️ Doctor Login
            </Link>
            <Link to="/doctor-login" className="doctor-btn">
              Doctor Dashboard →
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
