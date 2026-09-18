package com.telecare.controller;

import com.telecare.dto.PrescriptionRequest;
import com.telecare.model.Prescription;
import com.telecare.service.PrescriptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @PostMapping
    public ResponseEntity<?> createPrescription(@Valid @RequestBody PrescriptionRequest request) {
        try {
            Prescription prescription = prescriptionService.createPrescription(request);
            return ResponseEntity.ok(prescription);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable Long id) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionById(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Prescription>> getPatientPrescriptions(@PathVariable Long patientId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsForPatient(patientId));
    }

    @GetMapping("/consultation/{consultationId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByConsultation(@PathVariable Long consultationId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsByConsultationId(consultationId));
    }
}
