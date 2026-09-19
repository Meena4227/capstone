import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PatientDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.getPatientDashboard(user.id);
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load patient dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinConsultation = async (appointmentId) => {
    try {
      const consult = await api.getConsultationByAppointment(appointmentId);
      navigate(`/consultation/${consult.consultationId}`);
    } catch (err) {
      console.error('Failed to join consultation:', err);
      navigate('/consultation/1');
    }
  };

  const patient = dashboardData?.patient || user;
  const upcoming = dashboardData?.upcomingAppointment;
  const vitals = dashboardData?.vitals || {
    bloodGroup: patient?.bloodGroup || 'O+',
    weight: '60 kg',
    heartRate: '78 bpm',
    temperature: '98.6°F'
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar />

      <main className="patient-dashboard">
        {/* Welcome Section */}
        <section className="dashboard-welcome">
          <div>
            <div className="dashboard-badge">👤 PATIENT DASHBOARD</div>
            <h1>Hello, {patient?.name || 'Patient'}! 👋</h1>
            <p>How can we help you with your healthcare today? ❤️</p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <div className="action-card">
            <div className="action-icon">👨‍⚕️</div>
            <h3>Find a Doctor</h3>
            <p>Find qualified doctors and choose the right specialist for your needs.</p>
            <Link to="/doctors">Find Doctor →</Link>
          </div>

          <div className="action-card">
            <div className="action-icon">📅</div>
            <h3>Book Appointment</h3>
            <p>Select a doctor and book a convenient consultation time.</p>
            <Link to="/doctors">Book Now →</Link>
          </div>

          <div className="action-card">
            <div className="action-icon">📹</div>
            <h3>Online Consultation</h3>
            <p>Join your scheduled video consultation with your doctor.</p>
            {upcoming ? (
              <button
                onClick={() => handleJoinConsultation(upcoming.appointmentId)}
                className="text-btn-link"
              >
                Join Consultation →
              </button>
            ) : (
              <Link to="/doctors">Book Consultation →</Link>
            )}
          </div>

          <div className="action-card">
            <div className="action-icon">📋</div>
            <h3>Medical History</h3>
            <p>View your previous consultations and healthcare records.</p>
            <Link to="/medical-history">View History →</Link>
          </div>
        </section>

        {/* Appointment & Medical History Highlights */}
        <section className="dashboard-section">
          <div className="dashboard-history-card">
            <div className="history-card-icon">📋</div>
            <div>
              <h3>Medical History & Records</h3>
              <p>
                View your previous consultations, diagnoses, prescription details, and health
                status.
              </p>
              <Link to="/medical-history" className="dashboard-history-btn">
                📋 View Medical History
              </Link>
            </div>
          </div>

          <div className="section-title">
            <div>
              <span className="section-label">📅 APPOINTMENT</span>
              <h2>Upcoming Consultation</h2>
            </div>
            <Link to="/medical-history">View All →</Link>
          </div>

          {upcoming ? (
            <div className="appointment-card">
              <div className="doctor-profile">
                <div className="doctor-photo">{upcoming.doctor?.avatar || '👩‍⚕️'}</div>
                <div>
                  <h3>{upcoming.doctor?.name || 'Dr. Anjali Rao'}</h3>
                  <p>🩺 {upcoming.doctor?.specialization || 'General Medicine'}</p>
                  <span className="doctor-status">● Verified Doctor</span>
                </div>
              </div>

              <div className="appointment-details">
                <div>
                  <span>📅 Date</span>
                  <strong>{upcoming.appointmentDate}</strong>
                </div>
                <div>
                  <span>🕐 Time</span>
                  <strong>{upcoming.appointmentTime}</strong>
                </div>
                <div>
                  <span>📹 Type</span>
                  <strong>{upcoming.consultationType || 'Video Consultation'}</strong>
                </div>
              </div>

              <button
                onClick={() => handleJoinConsultation(upcoming.appointmentId)}
                className="join-btn"
              >
                📹 Join Consultation
              </button>
            </div>
          ) : (
            <div
              className="appointment-card"
              style={{ textAlign: 'center', display: 'block', padding: '30px' }}
            >
              <p style={{ color: '#718681', marginBottom: '15px' }}>
                No consultations scheduled currently.
              </p>
              <Link to="/doctors" className="join-btn" style={{ display: 'inline-block' }}>
                📅 Schedule a Consultation
              </Link>
            </div>
          )}
        </section>

        {/* Lower Section: Recent Activity & Health Overview */}
        <section className="dashboard-grid">
          {/* Recent Activity */}
          <div className="dashboard-panel">
            <div className="panel-heading">
              <h2>📋 Recent Activity</h2>
              <Link to="/medical-history">View All</Link>
            </div>

            <div className="activity">
              <div className="activity-icon">💊</div>
              <div>
                <strong>Prescription Received</strong>
                <p>Prescription from Dr. Anjali Rao (Paracetamol, Cetirizine)</p>
                <small>Today</small>
              </div>
            </div>

            <div className="activity">
              <div className="activity-icon">🩺</div>
              <div>
                <strong>Consultation Completed</strong>
                <p>General medicine consultation with Dr. Anjali Rao</p>
                <small>Yesterday</small>
              </div>
            </div>

            <div className="activity">
              <div className="activity-icon">📅</div>
              <div>
                <strong>Appointment Booked</strong>
                <p>Online video consultation confirmed</p>
                <small>2 days ago</small>
              </div>
            </div>
          </div>

          {/* Health Information */}
          <div className="dashboard-panel">
            <div className="panel-heading">
              <h2>❤️ Health Overview</h2>
              <Link to="/medical-history">View Profile</Link>
            </div>

            <div className="health-info">
              <div className="health-box">
                <span>🩸</span>
                <div>
                  <small>Blood Group</small>
                  <strong>{vitals.bloodGroup || 'O+'}</strong>
                </div>
              </div>

              <div className="health-box">
                <span>⚖️</span>
                <div>
                  <small>Weight</small>
                  <strong>{vitals.weight || '60 kg'}</strong>
                </div>
              </div>

              <div className="health-box">
                <span>❤️</span>
                <div>
                  <small>Heart Rate</small>
                  <strong>{vitals.heartRate || '78 bpm'}</strong>
                </div>
              </div>

              <div className="health-box">
                <span>🌡️</span>
                <div>
                  <small>Temperature</small>
                  <strong>{vitals.temperature || '98.6°F'}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Healthcare Message */}
        <section className="dashboard-message">
          <div className="message-icon">❤️</div>
          <div>
            <h2>Your health matters to us.</h2>
            <p>
              TeleCare makes it easier to connect with doctors, manage appointments and keep track of
              your healthcare journey from anywhere.
            </p>
          </div>
          <div className="message-doctor">👨‍⚕️ 👩‍⚕️ 🧑‍⚕️</div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
