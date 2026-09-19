package com.telecare.service;

import com.telecare.dto.ChatMessageRequest;
import com.telecare.dto.ConsultationNotesRequest;
import com.telecare.model.Appointment;
import com.telecare.model.ChatMessage;
import com.telecare.model.Consultation;
import com.telecare.repository.AppointmentRepository;
import com.telecare.repository.ChatMessageRepository;
import com.telecare.repository.ConsultationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConsultationService {

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public Consultation getConsultationById(Long consultationId) {
        return consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation not found with ID: " + consultationId));
    }

    public Consultation getConsultationByAppointmentId(Long appointmentId) {
        return consultationRepository.findByAppointment_AppointmentId(appointmentId)
                .orElseGet(() -> {
                    Appointment appointment = appointmentRepository.findById(appointmentId)
                            .orElseThrow(() -> new RuntimeException("Appointment not found: " + appointmentId));
                    Consultation c = Consultation.builder()
                            .appointment(appointment)
                            .type(appointment.getConsultationType())
                            .status("IN_PROGRESS")
                            .startTime(LocalDateTime.now())
                            .build();
                    return consultationRepository.save(c);
                });
    }

    @Transactional
    public Consultation updateConsultationNotes(Long consultationId, ConsultationNotesRequest request) {
        Consultation consultation = getConsultationById(consultationId);
        if (request.getNotes() != null) {
            consultation.setNotes(request.getNotes());
        }
        if (request.getDiagnosis() != null) {
            consultation.setDiagnosis(request.getDiagnosis());
        }
        if (request.getPrescriptionSummary() != null) {
            consultation.setPrescriptionSummary(request.getPrescriptionSummary());
        }
        if (request.getStatus() != null) {
            consultation.setStatus(request.getStatus());
            if ("COMPLETED".equalsIgnoreCase(request.getStatus())) {
                consultation.setEndTime(LocalDateTime.now());
                consultation.getAppointment().setStatus("COMPLETED");
                appointmentRepository.save(consultation.getAppointment());
            }
        }
        return consultationRepository.save(consultation);
    }

    public List<ChatMessage> getChatMessages(Long consultationId) {
        return chatMessageRepository.findByConsultationIdOrderBySentAtAsc(consultationId);
    }

    @Transactional
    public ChatMessage sendChatMessage(Long consultationId, ChatMessageRequest request) {
        ChatMessage message = ChatMessage.builder()
                .consultationId(consultationId)
                .senderRole(request.getSenderRole() != null ? request.getSenderRole() : "PATIENT")
                .senderName(request.getSenderName() != null ? request.getSenderName() : "User")
                .content(request.getContent())
                .build();
        return chatMessageRepository.save(message);
    }

    public List<Consultation> getConsultationsForPatient(Long patientId) {
        return consultationRepository.findByPatientId(patientId);
    }

    public List<Consultation> getConsultationsForDoctor(Long doctorId) {
        return consultationRepository.findByDoctorId(doctorId);
    }
}
