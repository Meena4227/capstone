import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('telecare_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('telecare_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('telecare_user');
    }
  }, [user]);

  const loginPatient = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.loginPatient(email, password);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const loginDoctor = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.loginDoctor(email, password);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const registerPatient = async (formData) => {
    setLoading(true);
    try {
      const data = await api.registerPatient(formData);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('telecare_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        loginPatient,
        loginDoctor,
        registerPatient,
        logout,
        isPatient: user?.role === 'ROLE_PATIENT',
        isDoctor: user?.role === 'ROLE_DOCTOR',
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
