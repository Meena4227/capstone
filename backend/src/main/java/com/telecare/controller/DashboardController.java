package com.telecare.controller;

import com.telecare.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<Map<String, Object>> getPatientDashboard(@PathVariable Long patientId) {
        return ResponseEntity.ok(dashboardService.getPatientDashboard(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<Map<String, Object>> getDoctorDashboard(@PathVariable Long doctorId) {
        return ResponseEntity.ok(dashboardService.getDoctorDashboard(doctorId));
    }
}
