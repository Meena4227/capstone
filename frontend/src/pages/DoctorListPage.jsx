import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
    fetchDoctors();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await api.getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const fetchDoctors = async (query = search, spec = selectedSpecialty) => {
    setLoading(true);
    try {
      const data = await api.getDoctors(query, spec);
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    fetchDoctors(val, selectedSpecialty);
  };

  const handleSpecialtyChange = (e) => {
    const val = e.target.value;
    setSelectedSpecialty(val);
    fetchDoctors(search, val);
  };

  return (
    <div className="doctor-page-wrapper">
      <Navbar />

      <main className="doctor-page">
        {/* Intro */}
        <section className="doctor-intro">
          <div className="doctor-main-icon">👨‍⚕️</div>
          <span className="doctor-label">🩺 TELECARE DOCTORS</span>
          <h1>
            Find the Right <span>Doctor</span> ❤️
          </h1>
          <p>Choose a qualified doctor and book your online consultation in seconds.</p>
        </section>

        {/* Search and Filters */}
        <section className="doctor-search">
          <input
            type="text"
            placeholder="🔍 Search doctor by name or specialty..."
            value={search}
            onChange={handleSearchChange}
          />

          <select value={selectedSpecialty} onChange={handleSpecialtyChange}>
            <option value="">🩺 All Specializations</option>
            {departments.map((dept) => (
              <option key={dept.departmentId} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </section>

        {/* Doctor Grid */}
        <section className="doctor-section">
          <h2>Our Doctors 👨‍⚕️👩‍⚕️</h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#47635e' }}>
              Loading qualified doctors...
            </div>
          ) : doctors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#718681' }}>
              No doctors found matching your criteria. Try adjusting your search.
            </div>
          ) : (
            <div className="doctor-grid">
              {doctors.map((doctor) => (
                <div className="doctor-card" key={doctor.doctorId}>
                  <div className="doctor-avatar">{doctor.avatar || '👨‍⚕️'}</div>

                  <span className="available">
                    {doctor.available ? '🟢 Available' : '🔴 In Consultation'}
                  </span>

                  <h3>{doctor.name}</h3>

                  <p className="specialization">🩺 {doctor.specialization}</p>

                  <p className="experience">
                    ⭐ {doctor.rating || '4.8'} | {doctor.experienceYears || '5'} Years Experience
                  </p>

                  <p className="doctor-description">{doctor.about}</p>

                  <div className="card-extra-info">
                    <p className="consultation-type">📹 Video Consultation</p>
                    <span className="doc-fee-badge">Fee: ₹{doctor.fee || '500'}</span>
                  </div>

                  <Link
                    to={`/book-appointment?doctorId=${doctor.doctorId}`}
                    className="book-doctor-btn"
                  >
                    📅 Book Appointment
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
