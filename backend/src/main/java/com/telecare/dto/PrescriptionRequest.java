package com.telecare.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PrescriptionRequest {
    @NotNull
    private Long consultationId;

    private String diagnosis;
    private String instructions;
    private LocalDate followUpDate;
    private List<PrescriptionItemDto> items;
}
