import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PatientRoute, DoctorRoute } from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import PatientLoginPage from './pages/PatientLoginPage';
import DoctorLoginPage from './pages/DoctorLoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorListPage from './pages/DoctorListPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import PatientDashboardPage from './pages/PatientDashboardPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import ConsultationPage from './pages/ConsultationPage';
import PrescriptionPage from './pages/PrescriptionPage';
import MedicalHistoryPage from './pages/MedicalHistoryPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<PatientLoginPage />} />
          <Route path="/doctor-login" element={<DoctorLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/doctors" element={<DoctorListPage />} />

          {/* Appointment Booking */}
          <Route path="/book-appointment" element={<BookAppointmentPage />} />

          {/* Patient Routes */}
          <Route
            path="/patient-dashboard"
            element={
              <PatientRoute>
                <PatientDashboardPage />
              </PatientRoute>
            }
          />
          <Route
            path="/medical-history"
            element={
              <PatientRoute>
                <MedicalHistoryPage />
              </PatientRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor-dashboard"
            element={
              <DoctorRoute>
                <DoctorDashboardPage />
              </DoctorRoute>
            }
          />

          {/* Shared Real-Time Consultation & Prescription */}
          <Route path="/consultation/:id" element={<ConsultationPage />} />
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/prescription/:id" element={<PrescriptionPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
