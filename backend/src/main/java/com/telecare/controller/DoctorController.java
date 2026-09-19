package com.telecare.controller;

import com.telecare.model.Department;
import com.telecare.model.Doctor;
import com.telecare.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getDoctors(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String specialization) {
        if (specialization != null && !specialization.isBlank() && !"All Specializations".equalsIgnoreCase(specialization)) {
            return ResponseEntity.ok(doctorService.getDoctorsBySpecialization(specialization));
        }
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(doctorService.searchDoctors(search));
        }
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/doctors/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getDepartments() {
        return ResponseEntity.ok(doctorService.getAllDepartments());
    }
}
