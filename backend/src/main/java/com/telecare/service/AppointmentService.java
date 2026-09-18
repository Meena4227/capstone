package com.telecare.service;

import com.telecare.dto.AppointmentRequest;
import com.telecare.model.Appointment;
import com.telecare.model.Consultation;
import com.telecare.model.Doctor;
import com.telecare.model.Patient;
import com.telecare.repository.AppointmentRepository;
import com.telecare.repository.ConsultationRepository;
import com.telecare.repository.DoctorRepository;
import com.telecare.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private ConsultationRepository consultationRepository;

    @Transactional
    public Appointment bookAppointment(Long patientId, AppointmentRequest request) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + patientId));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + request.getDoctorId()));

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(request.getAppointmentTime())
                .consultationType(request.getConsultationType() != null ? request.getConsultationType() : "VIDEO")
                .reason(request.getReason())
                .status("CONFIRMED")
                .fee(request.getFee() != null ? request.getFee() : (doctor.getFee() != null ? doctor.getFee() : 500.0))
                .build();

        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Pre-create Consultation session
        Consultation consultation = Consultation.builder()
                .appointment(savedAppointment)
                .type(savedAppointment.getConsultationType())
                .status("IN_PROGRESS")
                .build();
        consultationRepository.save(consultation);

        return savedAppointment;
    }

    public List<Appointment> getAppointmentsForPatient(Long patientId) {
        return appointmentRepository.findByPatient_PatientIdOrderByAppointmentDateDesc(patientId);
    }

    public List<Appointment> getAppointmentsForDoctor(Long doctorId) {
        return appointmentRepository.findByDoctor_DoctorIdOrderByAppointmentDateDesc(doctorId);
    }

    public Appointment getAppointmentById(Long appointmentId) {
        return appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentId));
    }

    public Appointment updateStatus(Long appointmentId, String status) {
        Appointment appointment = getAppointmentById(appointmentId);
        appointment.setStatus(status.toUpperCase());
        return appointmentRepository.save(appointment);
    }
}
