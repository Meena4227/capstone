import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    bloodGroup: 'O+',
    address: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { registerPatient } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!formData.agreeTerms) {
      setError('You must agree to the Terms & Conditions.');
      return;
    }

    setSubmitting(true);
    try {
      await registerPatient({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob || null,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        address: formData.address,
        password: formData.password
      });
      navigate('/patient-dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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

      <main className="register-page">
        <div className="register-container">
          <div className="register-intro">
            <div className="register-icon">👨‍⚕️</div>
            <h1>
              Start Your <span>Healthcare Journey</span> ❤️
            </h1>
            <p>
              Create your TeleCare patient account and connect with trusted doctors from anywhere.
            </p>
          </div>

          <div className="register-card">
            <div className="card-icon">📝</div>
            <h2>Create Patient Account 👋</h2>
            <p className="register-subtitle">Enter your details to get started.</p>

            {error && <div className="alert-box error-alert">⚠️ {error}</div>}

            <form onSubmit={handleSubmit}>
              <label htmlFor="name">👤 Full Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

              <label htmlFor="email">📧 Email Address</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
              />

              <label htmlFor="phone">📱 Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label htmlFor="dob">🎂 Date of Birth</label>
                  <input
                    type="date"
                    id="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="gender">⚧️ Gender</label>
                  <select id="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px' }}>
                <div>
                  <label htmlFor="bloodGroup">🩸 Blood Group</label>
                  <select id="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="address">🏠 Address / City</label>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Bangalore, Karnataka"
                  />
                </div>
              </div>

              <label htmlFor="password">🔒 Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />

              <label htmlFor="confirmPassword">🔐 Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />

              <label className="terms">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                />
                <span>
                  I agree to the <a href="#terms">Terms & Conditions</a> and <a href="#privacy">Privacy Policy</a>.
                </span>
              </label>

              <button type="submit" className="register-btn" disabled={submitting}>
                {submitting ? 'Creating Account...' : '📝 Create Account'}
              </button>
            </form>

            <div className="already-account">
              <p>Already have an account?</p>
              <Link to="/login">🔐 Login to TeleCare</Link>
            </div>

            <Link to="/" className="register-back">
              ← 🏠 Back to Home
            </Link>
          </div>

          <div className="register-benefits">
            <div>
              👨‍⚕️ <strong>Trusted Doctors</strong>
            </div>
            <div>
              📅 <strong>Easy Booking</strong>
            </div>
            <div>
              📹 <strong>Video Consultation</strong>
            </div>
            <div>
              ❤️ <strong>Patient Care</strong>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
