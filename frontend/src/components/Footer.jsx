import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="patient-footer">
      <div className="footer-brand">
        🩺 <strong>TeleCare</strong>
      </div>
      <p>
        💙 Making healthcare simple, accessible and convenient from anywhere.
      </p>
      <div className="footer-links">
        <Link to="/doctors">Find Doctors</Link> •{' '}
        <Link to="/login">Patient Portal</Link> •{' '}
        <Link to="/doctor-login">Doctor Portal</Link>
      </div>
      <p className="copyright">
        © 2026 TeleCare Telemedicine Platform. All rights reserved.
      </p>
    </footer>
  );
}
