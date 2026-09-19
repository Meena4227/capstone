package com.telecare.controller;

import com.telecare.dto.AppointmentRequest;
import com.telecare.model.Appointment;
import com.telecare.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/book/{patientId}")
    public ResponseEntity<?> bookAppointment(@PathVariable Long patientId, @Valid @RequestBody AppointmentRequest request) {
        try {
            Appointment appointment = appointmentService.bookAppointment(patientId, request);
            return ResponseEntity.ok(appointment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getPatientAppointments(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsForPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsForDoctor(doctorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "CONFIRMED");
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }
}
