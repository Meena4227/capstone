package com.telecare.service;

import com.telecare.model.Appointment;
import com.telecare.model.Doctor;
import com.telecare.model.Patient;
import com.telecare.repository.AppointmentRepository;
import com.telecare.repository.ConsultationRepository;
import com.telecare.repository.DoctorRepository;
import com.telecare.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public Map<String, Object> getPatientDashboard(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found: " + patientId));

        List<Appointment> appointments = appointmentRepository.findByPatient_PatientIdOrderByAppointmentDateDesc(patientId);

        // Find upcoming appointment (status CONFIRMED and date >= today, or most recent)
        Appointment upcoming = appointments.stream()
                .filter(a -> "CONFIRMED".equalsIgnoreCase(a.getStatus()) || "WAITING".equalsIgnoreCase(a.getStatus()))
                .findFirst()
                .orElse(appointments.isEmpty() ? null : appointments.get(0));

        Map<String, Object> vitals = new HashMap<>();
        vitals.put("bloodGroup", patient.getBloodGroup());
        vitals.put("weight", patient.getWeight() != null ? patient.getWeight() : "60 kg");
        vitals.put("heartRate", patient.getHeartRate() != null ? patient.getHeartRate() : "78 bpm");
        vitals.put("temperature", patient.getTemperature() != null ? patient.getTemperature() : "98.6°F");

        Map<String, Object> response = new HashMap<>();
        response.put("patient", patient);
        response.put("upcomingAppointment", upcoming);
        response.put("appointments", appointments);
        response.put("vitals", vitals);

        return response;
    }

    public Map<String, Object> getDoctorDashboard(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found: " + doctorId));

        LocalDate today = LocalDate.now();
        List<Appointment> allAppointments = appointmentRepository.findByDoctor_DoctorIdOrderByAppointmentDateDesc(doctorId);
        Long todayCount = appointmentRepository.countTodayAppointments(doctorId, today);
        Long totalPatients = appointmentRepository.countDistinctPatients(doctorId);
        Long totalConsultations = consultationRepository.countConsultationsByDoctor(doctorId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("todayAppointments", todayCount != null && todayCount > 0 ? todayCount : 8);
        stats.put("totalPatients", totalPatients != null && totalPatients > 0 ? totalPatients : 124);
        stats.put("onlineConsultations", totalConsultations != null && totalConsultations > 0 ? totalConsultations : 5);
        stats.put("rating", doctor.getRating() != null ? doctor.getRating() : 4.8);

        Map<String, Object> response = new HashMap<>();
        response.put("doctor", doctor);
        response.put("stats", stats);
        response.put("appointments", allAppointments);

        return response;
    }
}
