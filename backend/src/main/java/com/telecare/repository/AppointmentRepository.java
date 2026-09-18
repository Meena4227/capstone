package com.telecare.repository;

import com.telecare.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient_PatientIdOrderByAppointmentDateDesc(Long patientId);
    List<Appointment> findByDoctor_DoctorIdOrderByAppointmentDateDesc(Long doctorId);

    List<Appointment> findByDoctor_DoctorIdAndAppointmentDate(Long doctorId, LocalDate appointmentDate);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.doctorId = :doctorId AND a.appointmentDate = :date")
    Long countTodayAppointments(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(DISTINCT a.patient.patientId) FROM Appointment a WHERE a.doctor.doctorId = :doctorId")
    Long countDistinctPatients(@Param("doctorId") Long doctorId);
}
