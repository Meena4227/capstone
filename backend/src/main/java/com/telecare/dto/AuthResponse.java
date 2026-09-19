package com.telecare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private String role; // ROLE_PATIENT, ROLE_DOCTOR
    private String avatar;
    private String specialization;
}
