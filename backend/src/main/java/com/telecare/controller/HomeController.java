package com.telecare.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<?> home() {
        return ResponseEntity.ok(Map.of(
            "name", "TeleCare Telemedicine Platform API",
            "status", "ONLINE",
            "frontendUrl", "http://localhost:5173",
            "h2Console", "http://localhost:8080/h2-console",
            "endpoints", Map.of(
                "doctors", "/api/doctors",
                "departments", "/api/departments",
                "patientLogin", "/api/auth/patient/login",
                "doctorLogin", "/api/auth/doctor/login",
                "appointments", "/api/appointments"
            )
        ));
    }
}
