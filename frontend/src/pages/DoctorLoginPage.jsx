import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DoctorLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { loginDoctor } = useAuth();
  const navigate = useNavigate();

  const handleFillDemo = (docEmail) => {
    setEmail(docEmail);
    setPassword('password123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await loginDoctor(email, password);
      navigate('/doctor-dashboard');
    } catch (err) {
      setError(err.message || 'Doctor login failed. Check email and password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-full-page">
      <main className="doctor-login-page">
        <div className="doctor-login-card">
          <div className="doctor-login-icon">👨‍⚕️</div>
          <div className="doctor-login-brand">🩺 TeleCare</div>
          <span className="doctor-login-label">🏥 DOCTOR PORTAL</span>

          <h1>Welcome Back, Doctor! 👋</h1>
          <p>Login to manage your patients, appointments and consultations. 💙</p>

          {error && <div className="alert-box error-alert">⚠️ {error}</div>}

          {/* Quick Doctor Selector */}
          <div className="demo-doctor-pills">
            <span style={{ fontSize: '12px', color: '#718681', display: 'block', marginBottom: '6px' }}>
              Quick 1-Click Demo Login:
            </span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                className="chip-btn"
                onClick={() => handleFillDemo('doctor.anjali@telecare.com')}
              >
                👩‍⚕️ Dr. Anjali Rao
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => handleFillDemo('doctor.arun@telecare.com')}
              >
                👨‍⚕️ Dr. Arun Kumar
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => handleFillDemo('doctor.priya@telecare.com')}
              >
                👩‍⚕️ Dr. Priya Sharma
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <label>📧 Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your doctor email"
              required
            />

            <label>🔒 Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <div className="doctor-login-options">
              <label className="remember-doctor">
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <span style={{ fontSize: '13px', color: '#718681' }}>Password: password123</span>
            </div>

            <button type="submit" className="doctor-login-btn" disabled={submitting}>
              {submitting ? 'Verifying...' : '👨‍⚕️ Login to Doctor Dashboard'}
            </button>
          </form>

          <div className="doctor-login-message">
            🩺 &nbsp; Caring for patients, one consultation at a time. ❤️
          </div>

          <div className="doctor-back">
            <Link to="/">🏠 Back to Home</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
