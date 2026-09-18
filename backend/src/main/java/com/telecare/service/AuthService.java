package com.telecare.service;

import com.telecare.dto.AuthRequest;
import com.telecare.dto.AuthResponse;
import com.telecare.dto.RegisterRequest;
import com.telecare.model.Doctor;
import com.telecare.model.Patient;
import com.telecare.repository.DoctorRepository;
import com.telecare.repository.PatientRepository;
import com.telecare.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse loginPatient(AuthRequest request) {
        Patient patient = patientRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), patient.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(patient.getEmail(), patient.getPatientId(), "ROLE_PATIENT", patient.getName());
        return AuthResponse.builder()
                .token(token)
                .id(patient.getPatientId())
                .name(patient.getName())
                .email(patient.getEmail())
                .role("ROLE_PATIENT")
                .avatar("👤")
                .build();
    }

    public AuthResponse loginDoctor(AuthRequest request) {
        Doctor doctor = doctorRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Doctor account not found with this email"));

        if (!passwordEncoder.matches(request.getPassword(), doctor.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(doctor.getEmail(), doctor.getDoctorId(), "ROLE_DOCTOR", doctor.getName());
        return AuthResponse.builder()
                .token(token)
                .id(doctor.getDoctorId())
                .name(doctor.getName())
                .email(doctor.getEmail())
                .role("ROLE_DOCTOR")
                .avatar(doctor.getAvatar())
                .specialization(doctor.getSpecialization())
                .build();
    }

    public AuthResponse registerPatient(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (patientRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already registered");
        }

        Patient patient = Patient.builder()
                .name(request.getName())
                .email(email)
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .dob(request.getDob())
                .gender(request.getGender())
                .address(request.getAddress())
                .bloodGroup(request.getBloodGroup() != null ? request.getBloodGroup() : "O+")
                .weight("60 kg")
                .heartRate("78 bpm")
                .temperature("98.6°F")
                .build();

        Patient saved = patientRepository.save(patient);

        String token = jwtUtils.generateToken(saved.getEmail(), saved.getPatientId(), "ROLE_PATIENT", saved.getName());
        return AuthResponse.builder()
                .token(token)
                .id(saved.getPatientId())
                .name(saved.getName())
                .email(saved.getEmail())
                .role("ROLE_PATIENT")
                .avatar("👤")
                .build();
    }
}
