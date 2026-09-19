package com.telecare.service;

import com.telecare.model.MedicalRecord;
import com.telecare.model.Patient;
import com.telecare.repository.MedicalRecordRepository;
import com.telecare.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PatientRepository patientRepository;

    public List<MedicalRecord> getRecordsByPatient(Long patientId) {
        return medicalRecordRepository.findByPatient_PatientIdOrderByCreatedAtDesc(patientId);
    }

    public MedicalRecord addRecord(Long patientId, MedicalRecord record) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found: " + patientId));
        record.setPatient(patient);
        return medicalRecordRepository.save(record);
    }
}
