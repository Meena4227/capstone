package com.telecare.repository;

import com.telecare.model.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    Optional<Consultation> findByAppointment_AppointmentId(Long appointmentId);

    @Query("SELECT c FROM Consultation c WHERE c.appointment.patient.patientId = :patientId ORDER BY c.createdAt DESC")
    List<Consultation> findByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT c FROM Consultation c WHERE c.appointment.doctor.doctorId = :doctorId ORDER BY c.createdAt DESC")
    List<Consultation> findByDoctorId(@Param("doctorId") Long doctorId);

    @Query("SELECT COUNT(c) FROM Consultation c WHERE c.appointment.doctor.doctorId = :doctorId")
    Long countConsultationsByDoctor(@Param("doctorId") Long doctorId);
}
