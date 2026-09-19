package com.telecare.controller;

import com.telecare.dto.ChatMessageRequest;
import com.telecare.dto.ConsultationNotesRequest;
import com.telecare.model.ChatMessage;
import com.telecare.model.Consultation;
import com.telecare.service.ConsultationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    @Autowired
    private ConsultationService consultationService;

    @GetMapping("/{id}")
    public ResponseEntity<Consultation> getConsultation(@PathVariable Long id) {
        return ResponseEntity.ok(consultationService.getConsultationById(id));
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<Consultation> getConsultationByAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(consultationService.getConsultationByAppointmentId(appointmentId));
    }

    @PostMapping("/{id}/notes")
    public ResponseEntity<Consultation> updateNotes(
            @PathVariable Long id,
            @RequestBody ConsultationNotesRequest request) {
        return ResponseEntity.ok(consultationService.updateConsultationNotes(id, request));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<ChatMessage>> getMessages(@PathVariable Long id) {
        return ResponseEntity.ok(consultationService.getChatMessages(id));
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<ChatMessage> sendMessage(
            @PathVariable Long id,
            @Valid @RequestBody ChatMessageRequest request) {
        return ResponseEntity.ok(consultationService.sendChatMessage(id, request));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Consultation>> getPatientConsultations(@PathVariable Long patientId) {
        return ResponseEntity.ok(consultationService.getConsultationsForPatient(patientId));
    }
}
