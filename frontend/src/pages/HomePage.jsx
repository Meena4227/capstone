import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="home-page-wrapper">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="badge">
            ● NOW CONSULTING 24/7
          </div>

          <h1>
            Healthcare, <span>on call,</span> not on hold.
          </h1>

          <p>
            TeleCare puts a qualified doctor one video call away and gives every doctor
            a dashboard built to manage consultations without the chaos.
          </p>

          <div className="hero-buttons">
            <Link to="/doctors" className="primary-btn">
              Book a Consultation
            </Link>
            <Link to="/doctor-login" className="secondary-btn">
              Explore Doctor Dashboard
            </Link>
          </div>

          {/* Statistics */}
          <div className="stats">
            <div>
              <h2>1,240+</h2>
              <p>Consultations this month</p>
            </div>
            <div>
              <h2>180</h2>
              <p>Verified doctors</p>
            </div>
            <div>
              <h2>4.8/5</h2>
              <p>Average patient rating</p>
            </div>
          </div>
        </div>

        {/* Live Consultation Card */}
        <div className="consultation-card hero-preview-card">
          <div className="consultation-top">
            <span>LIVE CONSULTATION</span>
            <span className="status pulse">● In progress</span>
          </div>

          <div className="heartbeat pulse-beat">
            〰〰〰〰╱╲〰╲╱〰〰
          </div>

          <div className="consultation-info">
            <span>Heart rate — 78 bpm</span>
            <span className="timer">00:14:32</span>
          </div>

          <div className="doctor-info">
            <div className="doctor-avatar">👩‍⚕️</div>
            <div>
              <h3>Dr. Anjali Rao</h3>
              <p>General Medicine</p>
            </div>
            <Link to="/doctors" className="call-btn-circle" title="Consult Doctor">
              ☎
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="section-heading">
          <div className="small-badge">PLATFORM</div>
          <h2>Everything a consultation needs, nothing it doesn't.</h2>
          <p>
            Two experiences, one platform: a fast and reassuring booking flow for patients,
            and a command-center dashboard for doctors.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">📹</div>
            <h3>Video Consultations</h3>
            <p>
              High-definition video calls with in-call interactive chat, camera controls,
              and realtime diagnosis sharing directly in your browser.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Smart Scheduling</h3>
            <p>
              Patients select convenient time slots and preferred consultation modes,
              while doctors manage appointments in real time.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">☑</div>
            <h3>Doctor Dashboard</h3>
            <p>
              Patient queue, medical histories, vitals overview, and prescriptions available
              in one organized workspace.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">♡</div>
            <h3>Patient History</h3>
            <p>
              Consultations, prescriptions, diagnosis summaries, and lifestyle notes
              stored securely in your digital health record.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>E-Prescriptions</h3>
            <p>
              Doctors generate formal digital prescriptions with medicine dosages,
              frequencies, instructions, and instant print capability.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Private & Secure</h3>
            <p>
              End-to-end medical privacy safeguards keeping patient personal details
              and consultation records completely confidential.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="features" id="how" style={{ background: '#ffffff', padding: '60px 20px', borderTop: '1px solid #e5ebe7' }}>
        <div className="section-heading">
          <div className="small-badge">WORKFLOW</div>
          <h2>How TeleCare Works</h2>
          <p>Simple 3-step telemedicine process from booking to digital prescription.</p>
        </div>

        <div className="feature-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div className="feature-card step-card">
            <div className="step-number">1</div>
            <h3>Find Your Doctor</h3>
            <p>Search doctors by department, review ratings, experience, and consultation fees.</p>
          </div>
          <div className="feature-card step-card">
            <div className="step-number">2</div>
            <h3>Book & Connect</h3>
            <p>Select your date and time slot. Join the live consultation room with 1-click video call.</p>
          </div>
          <div className="feature-card step-card">
            <div className="step-number">3</div>
            <h3>Get Prescription</h3>
            <p>Receive digital prescription, treatment instructions, and access your full medical history.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
