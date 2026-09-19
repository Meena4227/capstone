import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

export default function PatientLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { loginPatient } = useAuth();
  const navigate = useNavigate();

  const handleFillDemo = () => {
    setEmail('patient@telecare.com');
    setPassword('password123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await loginPatient(email, password);
      navigate('/patient-dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-full-page">
      <header className="login-header">
        <Link to="/" className="logo">
          🩺 TeleCare
        </Link>
        <Link to="/" className="home-link">
          🏠 Home
        </Link>
      </header>

      <main className="patient-login">
        <div className="login-wrapper">
          <div className="login-intro">
            <div className="medical-icon">🏥</div>
            <h1>
              Your Health, <span>Our Priority</span> ❤️
            </h1>
            <p>
              Connect with trusted doctors, book appointments and receive healthcare from
              the comfort of your home.
            </p>
          </div>

          <div className="patient-login-card">
            <div className="card-icon">🩺</div>
            <h2>Welcome Back! 👋</h2>
            <p className="login-subtitle">Login to continue your healthcare journey.</p>

            {error && <div className="alert-box error-alert">⚠️ {error}</div>}

            <form onSubmit={handleSubmit}>
              <label htmlFor="email">📧 Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />

              <label htmlFor="password">🔒 Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer' }}
                  title="Toggle visibility"
                >
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </div>

              <div className="login-options">
                <label className="remember">
                  <input type="checkbox" defaultChecked /> Remember me
                </label>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="quick-demo-btn"
                  title="Auto-fill sample credentials"
                >
                  ✨ Auto-fill Demo
                </button>
              </div>

              <button type="submit" className="patient-login-btn" disabled={submitting}>
                {submitting ? 'Authenticating...' : '🔐 Login'}
              </button>
            </form>

            <div className="register-section">
              <p>Don't have an account?</p>
              <Link to="/register">📝 Create a Patient Account</Link>
            </div>

            <div className="login-divider">
              <span>or</span>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <Link to="/doctor-login" style={{ fontSize: '13px', color: '#17685f', fontWeight: 600 }}>
                Are you a healthcare professional? 👨‍⚕️ Doctor Login →
              </Link>
            </div>

            <Link to="/" className="back-home">
              🏠 Back to Home
            </Link>
          </div>

          {/* Healthcare Features Banner */}
          <div className="health-features">
            <div className="health-item">
              <div className="health-icon">👨‍⚕️</div>
              <div>
                <strong>Qualified Doctors</strong>
                <p>Trusted healthcare professionals</p>
              </div>
            </div>

            <div className="health-item">
              <div className="health-icon">📹</div>
              <div>
                <strong>Online Consultation</strong>
                <p>Consult from anywhere</p>
              </div>
            </div>

            <div className="health-item">
              <div className="health-icon">🔒</div>
              <div>
                <strong>Private & Secure</strong>
                <p>Your information is protected</p>
              </div>
            </div>

            <div className="health-item">
              <div className="health-icon">❤️</div>
              <div>
                <strong>Patient Care</strong>
                <p>Your health comes first</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
