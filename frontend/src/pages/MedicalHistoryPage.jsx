import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MedicalHistoryPage() {
  const { user } = useAuth();
  const patientId = user?.id || 1;

  const [consultations, setConsultations] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [patientId]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const [consults, records] = await Promise.all([
        api.getPatientConsultations(patientId),
        api.getPatientMedicalRecords(patientId)
      ]);
      setConsultations(consults);
      setMedicalRecords(records);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medical-history-page-wrapper">
      <Navbar />

      <main className="medical-history-page">
        {/* Heading */}
        <section className="medical-history-heading">
          <div className="history-icon">📋</div>
          <span>🩺 TELECARE HEALTH RECORD</span>
          <h1>Medical History 📋</h1>
          <p>View your previous consultations, diagnoses and digital prescriptions.</p>
        </section>

        {/* Patient Summary */}
        <section className="patient-summary">
          <div className="patient-avatar">👤</div>
          <div className="patient-info">
            <span>Patient</span>
            <h2>{user?.name || 'Meena Sekar'}</h2>
            <p>🩺 TeleCare Patient • {user?.email || 'patient@telecare.com'}</p>
          </div>
          <div className="health-status">
            <span>Current Status</span>
            <strong>🟢 Active</strong>
          </div>
        </section>

        {/* History Title */}
        <div className="history-title">
          <h2>🕒 Consultation History</h2>
          <p>Your recent healthcare visits and specialist consultations</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#47635e' }}>
            Loading consultation records...
          </div>
        ) : consultations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#718681' }}>
            No past consultation records found.
          </div>
        ) : (
          consultations.map((c) => {
            const appt = c.appointment;
            const doc = appt?.doctor;
            return (
              <section className="history-card" key={c.consultationId}>
                <div className="history-card-header">
                  <div className="doctor-history">
                    <div className="history-doctor-avatar">{doc?.avatar || '👩‍⚕️'}</div>
                    <div>
                      <h3>{doc?.name || 'Dr. Anjali Rao'}</h3>
                      <p>🩺 {doc?.specialization || 'General Medicine'}</p>
                    </div>
                  </div>
                  <span className="completed">✅ {c.status || 'Completed'}</span>
                </div>

                <div className="history-details">
                  <div>
                    <small>📅 Date</small>
                    <strong>{appt?.appointmentDate || '12 August 2026'}</strong>
                  </div>

                  <div>
                    <small>🕐 Time</small>
                    <strong>{appt?.appointmentTime || '10:30 AM'}</strong>
                  </div>

                  <div>
                    <small>📹 Type</small>
                    <strong>{appt?.consultationType || 'Video Consultation'}</strong>
                  </div>

                  <div>
                    <small>🩺 Diagnosis</small>
                    <strong>{c.diagnosis || 'Mild Fever & Cold'}</strong>
                  </div>
                </div>

                <div className="history-actions">
                  <Link to={`/prescription/${c.consultationId}`}>
                    💊 View Prescription
                  </Link>
                  <Link to={`/consultation/${c.consultationId}`}>
                    📹 Consultation Details
                  </Link>
                </div>
              </section>
            );
          })
        )}

        {/* Health Profile / Clinical Notes */}
        {medicalRecords.length > 0 && (
          <section className="prescription-card" style={{ marginTop: '30px' }}>
            <h2>📋 Clinical Diagnosis Records</h2>
            <div style={{ marginTop: '15px' }}>
              {medicalRecords.map((rec) => (
                <div
                  key={rec.recordId}
                  style={{
                    padding: '12px 16px',
                    background: '#f8faf9',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    border: '1px solid #e5ebe7'
                  }}
                >
                  <strong style={{ color: '#17685f' }}>🩺 {rec.diagnosis}</strong>
                  <div style={{ fontSize: '13px', color: '#718681', marginTop: '4px' }}>
                    Allergies: {rec.allergies || 'None'} • Chronic Conditions: {rec.chronicConditions || 'None'}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="history-back">
          <Link to="/patient-dashboard">← Back to Patient Dashboard</Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
