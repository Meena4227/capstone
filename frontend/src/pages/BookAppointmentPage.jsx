import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function BookAppointmentPage() {
  const [searchParams] = useSearchParams();
  const doctorIdParam = searchParams.get('doctorId') || searchParams.get('doctor');

  const { user, isPatient } = useAuth();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [appointmentTime, setAppointmentTime] = useState('10:30 AM');
  const [consultationType, setConsultationType] = useState('VIDEO');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadDoctor();
  }, [doctorIdParam]);

  const loadDoctor = async () => {
    setLoading(true);
    try {
      if (doctorIdParam && !isNaN(doctorIdParam)) {
        const doc = await api.getDoctorById(doctorIdParam);
        setDoctor(doc);
      } else {
        // Default to first doctor (Dr. Anjali Rao)
        const docs = await api.getDoctors();
        if (docs.length > 0) {
          if (doctorIdParam) {
            const found = docs.find((d) =>
              d.name.toLowerCase().includes(doctorIdParam.toLowerCase())
            );
            setDoctor(found || docs[0]);
          } else {
            setDoctor(docs[0]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load doctor:', err);
      setError('Could not load doctor details.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');

    if (!user || !isPatient) {
      alert('Please log in with your Patient account to book an appointment.');
      navigate('/login');
      return;
    }

    if (!doctor) {
      setError('Please select a valid doctor.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        doctorId: doctor.doctorId,
        appointmentDate,
        appointmentTime,
        consultationType,
        reason: reason || 'General Consultation',
        fee: doctor.fee || 500.0
      };

      const result = await api.bookAppointment(user.id, payload);
      setSuccess(true);

      // Fetch linked consultation and redirect
      setTimeout(async () => {
        try {
          const consult = await api.getConsultationByAppointment(result.appointmentId);
          navigate(`/consultation/${consult.consultationId}`);
        } catch {
          navigate('/patient-dashboard');
        }
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to book appointment. Try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="appointment-page-wrapper">
        <Navbar />
        <div style={{ textAlign: 'center', padding: '100px 20px', color: '#47635e' }}>
          Loading appointment booking...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="appointment-page-wrapper">
      <Navbar />

      <main className="appointment-page">
        <div className="appointment-container">
          {/* Intro */}
          <div className="appointment-intro">
            <div className="appointment-icon">📅</div>
            <span>🩺 TELECARE APPOINTMENTS</span>
            <h1>
              Book Your <span>Consultation</span> ❤️
            </h1>
            <p>Choose your preferred date and time to connect with your doctor.</p>
          </div>

          {/* Booking Card */}
          <div className="appointment-booking-card">
            {error && <div className="alert-box error-alert">⚠️ {error}</div>}
            {success && (
              <div className="alert-box success-alert">
                ✅ Appointment confirmed successfully! Redirecting to consultation room...
              </div>
            )}

            {/* Doctor Info */}
            {doctor && (
              <div className="selected-doctor">
                <div className="selected-doctor-avatar">{doctor.avatar || '👩‍⚕️'}</div>
                <div>
                  <span className="selected-label">SELECTED DOCTOR</span>
                  <h2>{doctor.name}</h2>
                  <p>🩺 {doctor.specialization}</p>
                  <span className="doctor-rating">
                    ⭐ {doctor.rating || '4.8'} &nbsp; | &nbsp; 🟢 Available
                  </span>
                </div>
              </div>
            )}

            <hr />

            {/* Form */}
            <form onSubmit={handleConfirm}>
              {/* Date */}
              <label htmlFor="appointment-date">📅 Select Appointment Date</label>
              <input
                type="date"
                id="appointment-date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
              />

              {/* Time */}
              <label htmlFor="appointment-time">🕐 Select Preferred Time</label>
              <select
                id="appointment-time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                required
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="05:00 PM">05:00 PM</option>
              </select>

              {/* Consultation Type */}
              <label>📹 Consultation Type</label>
              <div className="consultation-options">
                <label
                  className={`consult-option ${consultationType === 'VIDEO' ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="consultation"
                    value="VIDEO"
                    checked={consultationType === 'VIDEO'}
                    onChange={() => setConsultationType('VIDEO')}
                  />
                  <span>📹</span>
                  <div>
                    <strong>Video Consultation</strong>
                    <small>Talk to your doctor online</small>
                  </div>
                </label>

                <label
                  className={`consult-option ${consultationType === 'AUDIO' ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="consultation"
                    value="AUDIO"
                    checked={consultationType === 'AUDIO'}
                    onChange={() => setConsultationType('AUDIO')}
                  />
                  <span>📞</span>
                  <div>
                    <strong>Audio Consultation</strong>
                    <small>Talk to your doctor by phone</small>
                  </div>
                </label>
              </div>

              {/* Reason */}
              <label htmlFor="reason">📝 Reason for Consultation</label>
              <textarea
                id="reason"
                rows="4"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly describe your health concern (e.g. fever, headache, routine checkup)..."
              ></textarea>

              {/* Summary */}
              <div className="appointment-summary">
                <h3>📋 Appointment Summary</h3>
                <div>
                  <span>👨‍⚕️ Doctor</span>
                  <strong>{doctor?.name || 'Dr. Anjali Rao'}</strong>
                </div>
                <div>
                  <span>🩺 Specialization</span>
                  <strong>{doctor?.specialization || 'General Medicine'}</strong>
                </div>
                <div>
                  <span>💰 Consultation Fee</span>
                  <strong style={{ color: '#17685f' }}>₹{doctor?.fee || '500'}</strong>
                </div>
              </div>

              <button
                type="submit"
                className="confirm-appointment-btn"
                disabled={submitting || success}
              >
                {submitting ? 'Confirming...' : '✅ Confirm Appointment'}
              </button>
            </form>

            <Link to="/doctors" className="back-doctors">
              ← 👨‍⚕️ Choose Another Doctor
            </Link>
          </div>

          {/* Bottom Security Info */}
          <div className="appointment-message">
            <div style={{ fontSize: '24px' }}>🔒</div>
            <div>
              <strong>Your information is secure.</strong>
              <p>
                TeleCare protects your personal and healthcare information during your consultation.
              </p>
            </div>
            <div className="appointment-doctors">👨‍⚕️ 👩‍⚕️ 🩺 ❤️</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
