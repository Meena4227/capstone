const API_BASE_URL = 'http://localhost:8080/api';

function getAuthHeaders() {
  const user = JSON.parse(localStorage.getItem('telecare_user') || 'null');
  const headers = { 'Content-Type': 'application/json' };
  if (user && user.token) {
    headers['Authorization'] = `Bearer ${user.token}`;
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {})
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    let errorMsg = 'API request failed';
    try {
      const errJson = await response.json();
      errorMsg = errJson.message || errJson.error || errorMsg;
    } catch {
      errorMsg = await response.text();
    }
    throw new Error(errorMsg || `Error: ${response.status}`);
  }
  return response.json();
}

export const api = {
  // Auth
  loginPatient: (email, password) => request('/auth/patient/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  loginDoctor: (email, password) => request('/auth/doctor/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  registerPatient: (data) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Doctors & Departments
  getDoctors: (search = '', specialization = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (specialization) params.append('specialization', specialization);
    return request(`/doctors?${params.toString()}`);
  },
  getDoctorById: (id) => request(`/doctors/${id}`),
  getDepartments: () => request('/departments'),

  // Appointments
  bookAppointment: (patientId, data) => request(`/appointments/book/${patientId}`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getPatientAppointments: (patientId) => request(`/appointments/patient/${patientId}`),
  getDoctorAppointments: (doctorId) => request(`/appointments/doctor/${doctorId}`),
  getAppointmentById: (id) => request(`/appointments/${id}`),
  updateAppointmentStatus: (id, status) => request(`/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),

  // Consultations
  getConsultation: (id) => request(`/consultations/${id}`),
  getConsultationByAppointment: (appointmentId) => request(`/consultations/appointment/${appointmentId}`),
  updateConsultationNotes: (id, data) => request(`/consultations/${id}/notes`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getChatMessages: (consultationId) => request(`/consultations/${consultationId}/messages`),
  sendChatMessage: (consultationId, data) => request(`/consultations/${consultationId}/messages`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getPatientConsultations: (patientId) => request(`/consultations/patient/${patientId}`),

  // Prescriptions
  createPrescription: (data) => request('/prescriptions', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getPrescriptionById: (id) => request(`/prescriptions/${id}`),
  getPatientPrescriptions: (patientId) => request(`/prescriptions/patient/${patientId}`),
  getPrescriptionsByConsultation: (consultationId) => request(`/prescriptions/consultation/${consultationId}`),

  // Medical Records
  getPatientMedicalRecords: (patientId) => request(`/medical-records/patient/${patientId}`),
  addMedicalRecord: (patientId, data) => request(`/medical-records/patient/${patientId}`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Dashboards
  getPatientDashboard: (patientId) => request(`/dashboard/patient/${patientId}`),
  getDoctorDashboard: (doctorId) => request(`/dashboard/doctor/${doctorId}`),

  // Payments
  checkoutPayment: (data) => request('/payments/checkout', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};
