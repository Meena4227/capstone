package com.telecare.repository;

import com.telecare.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    Optional<Prescription> findByPrescriptionCode(String prescriptionCode);

    List<Prescription> findByConsultation_ConsultationId(Long consultationId);

    @Query("SELECT p FROM Prescription p WHERE p.consultation.appointment.patient.patientId = :patientId ORDER BY p.createdAt DESC")
    List<Prescription> findByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT p FROM Prescription p WHERE p.consultation.appointment.doctor.doctorId = :doctorId ORDER BY p.createdAt DESC")
    List<Prescription> findByDoctorId(@Param("doctorId") Long doctorId);
}
