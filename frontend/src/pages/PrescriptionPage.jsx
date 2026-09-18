import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrescriptionPage() {
  const { id } = useParams();
  const consultationId = id || '1';
  const { user, isDoctor } = useAuth();
  const navigate = useNavigate();

  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state for doctor writing a prescription
  const [diagnosis, setDiagnosis] = useState('Mild fever and common cold symptoms');
  const [instructions, setInstructions] = useState(
    'Drink plenty of water. Take adequate rest. Maintain a healthy diet. Avoid unnecessary physical stress.'
  );
  const [followUpDays, setFollowUpDays] = useState(7);
  const [items, setItems] = useState([
    { medicineName: 'Paracetamol 500mg', dosage: '1 tablet × 2/day', frequency: 'Twice a day', duration: '3 Days' },
    { medicineName: 'Cetirizine 10mg', dosage: '1 tablet at night', frequency: 'Once a day', duration: '5 Days' },
    { medicineName: 'Vitamin C', dosage: '1 tablet/day', frequency: 'Once a day', duration: '7 Days' }
  ]);
  const [newItem, setNewItem] = useState({ medicineName: '', dosage: '', frequency: 'Twice a day', duration: '5 Days' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPrescription();
  }, [consultationId]);

  const loadPrescription = async () => {
    setLoading(true);
    try {
      const rxList = await api.getPrescriptionsByConsultation(consultationId);
      if (rxList && rxList.length > 0) {
        setPrescription(rxList[0]);
      } else {
        // Fallback: try by ID directly
        try {
          const rx = await api.getPrescriptionById(consultationId);
          setPrescription(rx);
        } catch {
          // If none exists, keep null so doctor can write it
        }
      }
    } catch (err) {
      console.error('Error loading prescription:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (!newItem.medicineName.trim()) return;
    setItems((prev) => [...prev, newItem]);
    setNewItem({ medicineName: '', dosage: '', frequency: 'Twice a day', duration: '5 Days' });
  };

  const handleRemoveItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSavePrescription = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const followUpDate = new Date();
      followUpDate.setDate(followUpDate.getDate() + Number(followUpDays));

      const payload = {
        consultationId: Number(consultationId),
        diagnosis,
        instructions,
        followUpDate: followUpDate.toISOString().split('T')[0],
        items
      };

      const saved = await api.createPrescription(payload);
      setPrescription(saved);
      alert('💊 Prescription saved and assigned successfully!');
    } catch (err) {
      console.error('Failed to create prescription:', err);
      alert('Failed to save prescription.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="prescription-page-wrapper">
      <Navbar />

      <main className="prescription-page">
        {/* Heading */}
        <section className="prescription-heading">
          <div className="prescription-icon">💊</div>
          <span>🩺 TELECARE HEALTHCARE</span>
          <h1>Your Prescription 📋</h1>
          <p>View your doctor's prescription and treatment instructions.</p>
        </section>

        {/* Doctor Prescription Creator Mode (if doctor and wants to write/edit) */}
        {isDoctor && (
          <section className="prescription-card" style={{ marginBottom: '30px' }}>
            <h2>📝 Doctor Prescription Form</h2>
            <p style={{ color: '#718681', marginBottom: '20px' }}>
              Add medicines, dosages, instructions, and save to patient digital record.
            </p>

            <form onSubmit={handleSavePrescription}>
              <label>🩺 Diagnosis</label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Enter diagnosis"
                required
              />

              <label>💊 Medicines to Prescribe</label>
              <div style={{ background: '#f8faf9', padding: '15px', borderRadius: '10px', marginBottom: '15px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
                  <div>
                    <small>Medicine Name</small>
                    <input
                      type="text"
                      placeholder="e.g. Paracetamol 500mg"
                      value={newItem.medicineName}
                      onChange={(e) => setNewItem({ ...newItem, medicineName: e.target.value })}
                    />
                  </div>
                  <div>
                    <small>Dosage</small>
                    <input
                      type="text"
                      placeholder="1 tablet"
                      value={newItem.dosage}
                      onChange={(e) => setNewItem({ ...newItem, dosage: e.target.value })}
                    />
                  </div>
                  <div>
                    <small>Frequency</small>
                    <select
                      value={newItem.frequency}
                      onChange={(e) => setNewItem({ ...newItem, frequency: e.target.value })}
                    >
                      <option>Once a day</option>
                      <option>Twice a day</option>
                      <option>Three times a day</option>
                    </select>
                  </div>
                  <div>
                    <small>Duration</small>
                    <input
                      type="text"
                      placeholder="5 Days"
                      value={newItem.duration}
                      onChange={(e) => setNewItem({ ...newItem, duration: e.target.value })}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="primary-btn"
                    style={{ padding: '10px 16px', fontSize: '13px' }}
                  >
                    + Add
                  </button>
                </div>

                {/* Added Medicines List */}
                <div style={{ marginTop: '15px' }}>
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: '#ffffff',
                        borderRadius: '6px',
                        marginBottom: '6px',
                        border: '1px solid #e5ebe7'
                      }}
                    >
                      <span>
                        💊 <strong>{item.medicineName}</strong> — {item.dosage} ({item.frequency}) for {item.duration}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        style={{ color: '#ff6853', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <label>📝 Doctor's Instructions</label>
              <textarea
                rows="3"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Dietary instructions, rest, precautions..."
              />

              <label>🔔 Follow-up After (Days)</label>
              <input
                type="number"
                value={followUpDays}
                onChange={(e) => setFollowUpDays(e.target.value)}
                min="1"
                max="30"
              />

              <button
                type="submit"
                className="save-prescription-btn"
                disabled={saving}
                style={{ marginTop: '15px' }}
              >
                {saving ? 'Saving...' : '💾 Save Prescription'}
              </button>
            </form>
          </section>
        )}

        {/* Printable Formal Prescription Card */}
        <section className="prescription-card print-section">
          {/* Doctor Information */}
          <div className="prescription-doctor">
            <div className="doctor-prescription-avatar">👩‍⚕️</div>
            <div>
              <span>Prescribed by</span>
              <h2>
                {prescription?.consultation?.appointment?.doctor?.name || 'Dr. Anjali Rao'}
              </h2>
              <p>
                🩺{' '}
                {prescription?.consultation?.appointment?.doctor?.specialization ||
                  'General Medicine'}
              </p>
              <p>⭐ 4.8 &nbsp; | &nbsp; 🟢 Verified Doctor</p>
            </div>
          </div>

          {/* Patient Information */}
          <div className="patient-prescription-info">
            <div>
              <small>👤 Patient</small>
              <strong>
                {prescription?.consultation?.appointment?.patient?.name || 'Meena Sekar'}
              </strong>
            </div>

            <div>
              <small>📅 Consultation Date</small>
              <strong>
                {prescription?.createdAt
                  ? new Date(prescription.createdAt).toLocaleDateString()
                  : 'Today'}
              </strong>
            </div>

            <div>
              <small>🆔 Prescription ID</small>
              <strong>{prescription?.prescriptionCode || 'TC-2026-001'}</strong>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="diagnosis-box">
            <h3>🩺 Diagnosis</h3>
            <p>
              {prescription?.diagnosis ||
                diagnosis ||
                'Mild fever and common cold symptoms.'}
            </p>
          </div>

          {/* Medicines Table */}
          <div className="medicine-section">
            <h2>💊 Medicines</h2>
            <div className="medicine-table">
              <div className="medicine-header">
                <span>Medicine</span>
                <span>Dosage</span>
                <span>Duration</span>
              </div>

              {(prescription?.items && prescription.items.length > 0 ? prescription.items : items).map(
                (med, i) => (
                  <div className="medicine-row" key={i}>
                    <span>💊 {med.medicineName}</span>
                    <span>{med.dosage}</span>
                    <span>{med.duration}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Doctor Instructions */}
          <div className="instructions-box">
            <h2>📝 Doctor's Instructions</h2>
            <ul>
              <li>💧 Drink plenty of water (at least 2.5–3L daily).</li>
              <li>🛌 Take adequate rest and avoid fatigue.</li>
              <li>🥗 Maintain a healthy diet with fresh warm meals.</li>
              <li>🚫 Avoid unnecessary physical stress and cold beverages.</li>
            </ul>
          </div>

          {/* Follow Up */}
          <div className="follow-up">
            <div>
              <span>🔔 Follow-up</span>
              <strong>Follow-up consultation recommended</strong>
            </div>
            <span>
              📅{' '}
              {prescription?.followUpDate
                ? prescription.followUpDate
                : 'After 7 days'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="prescription-actions no-print">
            <button onClick={() => window.print()}>
              🖨️ Print Prescription
            </button>
            <Link to={isDoctor ? '/doctor-dashboard' : '/patient-dashboard'}>
              ← Back to Dashboard
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
