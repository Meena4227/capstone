import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctorDashboard();
  }, [user]);

  const loadDoctorDashboard = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.getDoctorDashboard(user.id);
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load doctor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartConsultation = async (appointmentId) => {
    try {
      const consult = await api.getConsultationByAppointment(appointmentId);
      navigate(`/consultation/${consult.consultationId}`);
    } catch (err) {
      console.error('Failed to start consultation:', err);
      navigate('/consultation/1');
    }
  };

  const doctor = dashboardData?.doctor || user;
  const stats = dashboardData?.stats || {
    todayAppointments: 8,
    totalPatients: 124,
    onlineConsultations: 5,
    rating: 4.8
  };
  const appointments = dashboardData?.appointments || [];

  return (
    <div className="dashboard-wrapper">
      <Navbar />

      <main className="doctor-dashboard">
        {/* Welcome */}
        <section className="doctor-welcome">
          <div>
            <span>🏥 DOCTOR DASHBOARD</span>
            <h1>Good Morning, {doctor?.name || 'Doctor'}! 👋</h1>
            <p>Manage your patients, appointments and online consultations with ease.</p>
          </div>
          <div className="doctor-welcome-icon">{doctor?.avatar || '👩‍⚕️'}</div>
        </section>

        {/* Statistics */}
        <section className="doctor-stats">
          <div className="doctor-stat-card">
            <div className="stat-icon">📅</div>
            <span>Today's Appointments</span>
            <strong>{String(stats.todayAppointments).padStart(2, '0')}</strong>
          </div>

          <div className="doctor-stat-card">
            <div className="stat-icon">👥</div>
            <span>Total Patients</span>
            <strong>{stats.totalPatients}</strong>
          </div>

          <div className="doctor-stat-card">
            <div className="stat-icon">📹</div>
            <span>Online Consultations</span>
            <strong>{String(stats.onlineConsultations).padStart(2, '0')}</strong>
          </div>

          <div className="doctor-stat-card">
            <div className="stat-icon">⭐</div>
            <span>Patient Rating</span>
            <strong>{stats.rating}</strong>
          </div>
        </section>

        {/* Today's Appointments */}
        <section className="appointments-section">
          <div className="section-heading" style={{ margin: '0 0 20px 0' }}>
            <div>
              <h2>📅 Today's Appointments</h2>
              <p>Manage your upcoming patient consultations and launch instant video calls.</p>
            </div>
            <span className="appointment-count">{appointments.length} Appointments</span>
          </div>

          {appointments.map((appt) => (
            <div className="doctor-appointment-card" key={appt.appointmentId}>
              <div className="appointment-patient">
                <div className="patient-small-avatar">
                  {appt.patient?.gender === 'Female' ? '👩' : '👨'}
                </div>
                <div>
                  <h3>{appt.patient?.name || 'Patient'}</h3>
                  <p>🤒 {appt.reason || 'General Consultation'}</p>
                  <small style={{ color: '#718681' }}>
                    Blood Group: {appt.patient?.bloodGroup || 'O+'} • Phone: {appt.patient?.phone}
                  </small>
                </div>
              </div>

              <div className="appointment-time">
                <span>🕐 Time</span>
                <strong>{appt.appointmentTime}</strong>
              </div>

              <div
                className="appointment-status"
                style={{
                  color: appt.status === 'CONFIRMED' ? '#17685f' : '#b27b00',
                  background: appt.status === 'CONFIRMED' ? '#e7f5ef' : '#fdf6e2'
                }}
              >
                {appt.status === 'CONFIRMED' ? '🟢 Confirmed' : '🟡 Waiting'}
              </div>

              <button
                onClick={() => handleStartConsultation(appt.appointmentId)}
                className="start-consultation-btn"
              >
                📹 Start Consultation
              </button>
            </div>
          ))}

          {appointments.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#718681' }}>
              No appointments scheduled for today.
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="doctor-quick-actions">
          <h2>⚡ Quick Actions</h2>

          <div className="quick-action-grid">
            <div
              className="quick-action-card"
              onClick={() => {
                if (appointments[0]) handleStartConsultation(appointments[0].appointmentId);
                else navigate('/consultation/1');
              }}
              style={{ cursor: 'pointer' }}
            >
              <span>📹</span>
              <strong>Start Consultation</strong>
              <small>Connect with queued patient</small>
            </div>

            <Link to="/prescription/1" className="quick-action-card">
              <span>💊</span>
              <strong>Prescriptions</strong>
              <small>View or create prescriptions</small>
            </Link>

            <Link to="/medical-history" className="quick-action-card">
              <span>📋</span>
              <strong>Patient History</strong>
              <small>View patient medical records</small>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
