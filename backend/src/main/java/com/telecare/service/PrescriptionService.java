package com.telecare.service;

import com.telecare.dto.PrescriptionItemDto;
import com.telecare.dto.PrescriptionRequest;
import com.telecare.model.*;
import com.telecare.repository.ConsultationRepository;
import com.telecare.repository.MedicalRecordRepository;
import com.telecare.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Transactional
    public Prescription createPrescription(PrescriptionRequest request) {
        Consultation consultation = consultationRepository.findById(request.getConsultationId())
                .orElseThrow(() -> new RuntimeException("Consultation not found: " + request.getConsultationId()));

        long count = prescriptionRepository.count() + 1;
        String code = String.format("TC-2026-%03d", count);

        Prescription prescription = Prescription.builder()
                .consultation(consultation)
                .prescriptionCode(code)
                .diagnosis(request.getDiagnosis())
                .instructions(request.getInstructions())
                .followUpDate(request.getFollowUpDate() != null ? request.getFollowUpDate() : LocalDate.now().plusDays(7))
                .build();

        List<PrescriptionItem> items = new ArrayList<>();
        if (request.getItems() != null) {
            for (PrescriptionItemDto itemDto : request.getItems()) {
                PrescriptionItem item = PrescriptionItem.builder()
                        .prescription(prescription)
                        .medicineName(itemDto.getMedicineName())
                        .dosage(itemDto.getDosage())
                        .frequency(itemDto.getFrequency())
                        .duration(itemDto.getDuration())
                        .build();
                items.add(item);
            }
        }
        prescription.setItems(items);

        Prescription saved = prescriptionRepository.save(prescription);

        // Update consultation diagnosis & notes
        consultation.setDiagnosis(request.getDiagnosis());
        consultationRepository.save(consultation);

        // Optionally record in patient's medical history
        Patient patient = consultation.getAppointment().getPatient();
        MedicalRecord record = MedicalRecord.builder()
                .patient(patient)
                .diagnosis(request.getDiagnosis())
                .allergies("None reported")
                .chronicConditions("None")
                .surgicalHistory("None")
                .build();
        medicalRecordRepository.save(record);

        return saved;
    }

    public Prescription getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with ID: " + id));
    }

    public List<Prescription> getPrescriptionsForPatient(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    public List<Prescription> getPrescriptionsByConsultationId(Long consultationId) {
        return prescriptionRepository.findByConsultation_ConsultationId(consultationId);
    }
}
