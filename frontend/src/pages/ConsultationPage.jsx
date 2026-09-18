import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ConsultationPage() {
  const { id } = useParams();
  const consultationId = id || '1';
  const { user, isDoctor } = useAuth();
  const navigate = useNavigate();

  const [consultation, setConsultation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(872); // seconds (14m 32s)
  const [doctorNotes, setDoctorNotes] = useState('');
  const [doctorDiagnosis, setDoctorDiagnosis] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const chatBottomRef = useRef(null);

  useEffect(() => {
    loadConsultationData();
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    const messagePoller = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(messagePoller);
    };
  }, [consultationId]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConsultationData = async () => {
    try {
      const data = await api.getConsultation(consultationId);
      setConsultation(data);
      setDoctorNotes(data.notes || '');
      setDoctorDiagnosis(data.diagnosis || '');
      fetchMessages();
    } catch (err) {
      console.error('Failed to load consultation:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const msgs = await api.getChatMessages(consultationId);
      setMessages(msgs);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const senderRole = isDoctor ? 'DOCTOR' : 'PATIENT';
    const senderName = user?.name || (isDoctor ? 'Dr. Anjali Rao' : 'Meena Sekar');

    try {
      const sent = await api.sendChatMessage(consultationId, {
        content: newMessage.trim(),
        senderRole,
        senderName
      });
      setMessages((prev) => [...prev, sent]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await api.updateConsultationNotes(consultationId, {
        notes: doctorNotes,
        diagnosis: doctorDiagnosis
      });
      alert('Consultation notes updated successfully!');
    } catch (err) {
      console.error('Failed to save notes:', err);
      alert('Failed to save notes.');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleEndCall = () => {
    if (window.confirm('Are you sure you want to end this consultation?')) {
      if (isDoctor) {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    }
  };

  const formatTimer = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const doctorName = consultation?.appointment?.doctor?.name || 'Dr. Anjali Rao';
  const patientName = consultation?.appointment?.patient?.name || 'Meena Sekar';
  const specialization =
    consultation?.appointment?.doctor?.specialization || 'General Medicine';

  return (
    <div className="consultation-page-wrapper">
      <Navbar />

      <main className="consultation-page">
        {/* Heading */}
        <section className="consultation-heading">
          <span>📹 TELECARE ONLINE CONSULTATION</span>
          <h1>
            Your Consultation with <strong>{isDoctor ? patientName : doctorName}</strong>{' '}
            {isDoctor ? '👤' : '👩‍⚕️'}
          </h1>
          <p>
            🩺 {specialization} &nbsp; • &nbsp; 📅 Today &nbsp; • &nbsp; 🕐{' '}
            {consultation?.appointment?.appointmentTime || '10:30 AM'}
          </p>
        </section>

        {/* Video and Chat Layout */}
        <section className="consultation-layout">
          {/* Video Section */}
          <div className="video-section">
            <div className={`doctor-video ${isVideoOff ? 'video-off' : ''}`}>
              <div className="doctor-video-icon">{isDoctor ? '👤' : '👩‍⚕️'}</div>
              <h2>{isDoctor ? patientName : doctorName}</h2>
              <p>🟢 Connected • HD Audio</p>
              <span className="video-status">
                {isVideoOff ? '📹 Video Muted' : '📹 HD 1080p'}
              </span>

              {/* Live Heartbeat / Call Timer Bar */}
              <div className="in-call-timer-bar">
                <span>⏱️ {formatTimer(callDuration)}</span>
                <span>❤️ 78 bpm</span>
              </div>
            </div>

            {/* Picture-in-picture Self Video */}
            <div className="patient-video">
              <div className="pip-avatar">{isDoctor ? '👩‍⚕️' : '👤'}</div>
              <span>{isDoctor ? 'You (Doctor)' : 'You (Patient)'}</span>
              {isMuted && <span className="muted-badge">🔇 Muted</span>}
            </div>

            {/* Video Controls */}
            <div className="video-controls">
              <button
                className={`control-btn ${isMuted ? 'active-mute' : ''}`}
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {isMuted ? '🔇' : '🎤'}
                <small>{isMuted ? 'Unmute' : 'Mute'}</small>
              </button>

              <button
                className={`control-btn ${isVideoOff ? 'active-mute' : ''}`}
                onClick={() => setIsVideoOff(!isVideoOff)}
                title={isVideoOff ? 'Turn video on' : 'Turn video off'}
              >
                {isVideoOff ? '🚫' : '📹'}
                <small>{isVideoOff ? 'Start Video' : 'Stop Video'}</small>
              </button>

              <button
                className={`control-btn ${!isSpeakerOn ? 'active-mute' : ''}`}
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                title="Toggle speaker"
              >
                🔊
                <small>{isSpeakerOn ? 'Speaker' : 'Mute Spk'}</small>
              </button>

              <button className="control-btn end-call" onClick={handleEndCall} title="End call">
                📞
                <small>End</small>
              </button>
            </div>
          </div>

          {/* Interactive Live Chat */}
          <div className="chat-section">
            <div className="chat-header">
              <h2>💬 Consultation Chat</h2>
              <span>🟢 {isDoctor ? 'Patient is online' : 'Doctor is online'}</span>
            </div>

            <div className="chat-messages">
              {messages.map((msg, index) => {
                const isMine =
                  (isDoctor && msg.senderRole === 'DOCTOR') ||
                  (!isDoctor && msg.senderRole === 'PATIENT');

                return (
                  <div
                    key={msg.id || index}
                    className={isMine ? 'patient-message' : 'doctor-message'}
                  >
                    {!isMine && (
                      <span>{msg.senderRole === 'DOCTOR' ? '👩‍⚕️' : '👤'}</span>
                    )}
                    <div>
                      <strong>{msg.senderName}</strong>
                      <p>{msg.content}</p>
                      <small>
                        {msg.sentAt
                          ? new Date(msg.sentAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Just now'}
                      </small>
                    </div>
                    {isMine && (
                      <span>{msg.senderRole === 'DOCTOR' ? '👩‍⚕️' : '👤'}</span>
                    )}
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            <form onSubmit={handleSendMessage} className="chat-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit">➤</button>
            </form>
          </div>
        </section>

        {/* Consultation Details Grid */}
        <section className="consultation-details">
          <div className="detail-card">
            <span>👩‍⚕️</span>
            <div>
              <small>Doctor</small>
              <strong>{doctorName}</strong>
            </div>
          </div>

          <div className="detail-card">
            <span>🩺</span>
            <div>
              <small>Specialization</small>
              <strong>{specialization}</strong>
            </div>
          </div>

          <div className="detail-card">
            <span>⏱️</span>
            <div>
              <small>Elapsed Duration</small>
              <strong>{formatTimer(callDuration)}</strong>
            </div>
          </div>

          <div className="detail-card">
            <span>🔒</span>
            <div>
              <small>Security</small>
              <strong>Secure & Encrypted</strong>
            </div>
          </div>
        </section>

        {/* Doctor Consultation Notes & Prescription Access */}
        <section className="consultation-notes">
          <div className="notes-heading">
            <span>📝</span>
            <div>
              <h2>Consultation Notes & Diagnosis</h2>
              <p>
                {isDoctor
                  ? 'Record patient diagnosis, clinical observations, and dietary recommendations.'
                  : 'Notes and instructions from your doctor appear here in real time.'}
              </p>
            </div>
          </div>

          {isDoctor ? (
            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                Diagnosis:
              </label>
              <input
                type="text"
                value={doctorDiagnosis}
                onChange={(e) => setDoctorDiagnosis(e.target.value)}
                placeholder="e.g. Mild fever, Acute Pharyngitis"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #dce5e1', marginBottom: '14px' }}
              />

              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                Clinical Notes & Care Plan:
              </label>
              <textarea
                rows="4"
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="Enter clinical notes, patient symptoms, and follow-up guidance..."
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #dce5e1', marginBottom: '14px' }}
              />

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="primary-btn"
                  disabled={savingNotes}
                  style={{ cursor: 'pointer' }}
                >
                  {savingNotes ? 'Saving...' : '💾 Save Notes'}
                </button>
                <Link
                  to={`/prescription/${consultationId}`}
                  className="view-prescription-btn"
                >
                  💊 Write / View Prescription →
                </Link>
              </div>
            </div>
          ) : (
            <div className="notes-content">
              <p>
                <strong>Diagnosis:</strong> {doctorDiagnosis || 'Mild fever and common cold symptoms.'}
              </p>
              <p style={{ marginTop: '10px' }}>
                {doctorNotes ||
                  '💡 Your doctor has noted: Drink plenty of warm water, get adequate rest, and monitor temperature regularly.'}
              </p>
              <Link to={`/prescription/${consultationId}`} className="view-prescription-btn">
                📄 View Prescription
              </Link>
            </div>
          )}
        </section>

        {/* End Consultation bar */}
        <div className="end-consultation">
          <p>
            ❤️ Please make sure you have discussed all your health concerns with your doctor.
          </p>
          <button onClick={handleEndCall} className="end-call-link-btn">
            End Consultation & Return to Dashboard
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
