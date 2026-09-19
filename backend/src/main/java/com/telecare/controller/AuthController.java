package com.telecare.controller;

import com.telecare.dto.AuthRequest;
import com.telecare.dto.AuthResponse;
import com.telecare.dto.RegisterRequest;
import com.telecare.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/patient/login")
    public ResponseEntity<?> loginPatient(@Valid @RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.loginPatient(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/doctor/login")
    public ResponseEntity<?> loginDoctor(@Valid @RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.loginDoctor(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerPatient(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.registerPatient(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
