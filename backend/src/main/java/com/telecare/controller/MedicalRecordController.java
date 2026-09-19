package com.telecare.controller;

import com.telecare.model.MedicalRecord;
import com.telecare.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecord>> getPatientRecords(@PathVariable Long patientId) {
        return ResponseEntity.ok(medicalRecordService.getRecordsByPatient(patientId));
    }

    @PostMapping("/patient/{patientId}")
    public ResponseEntity<MedicalRecord> addRecord(@PathVariable Long patientId, @RequestBody MedicalRecord record) {
        return ResponseEntity.ok(medicalRecordService.addRecord(patientId, record));
    }
}
