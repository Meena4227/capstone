package com.telecare.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AppointmentRequest {
    @NotNull
    private Long doctorId;

    @NotNull
    private LocalDate appointmentDate;

    @NotNull
    private String appointmentTime;

    private String consultationType; // VIDEO, AUDIO

    private String reason;

    private Double fee;
}
