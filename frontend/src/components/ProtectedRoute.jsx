import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PatientRoute({ children }) {
  const { user, isPatient } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!isPatient) {
    return <Navigate to="/doctor-dashboard" replace />;
  }
  return children;
}

export function DoctorRoute({ children }) {
  const { user, isDoctor } = useAuth();
  if (!user) {
    return <Navigate to="/doctor-login" replace />;
  }
  if (!isDoctor) {
    return <Navigate to="/patient-dashboard" replace />;
  }
  return children;
}
