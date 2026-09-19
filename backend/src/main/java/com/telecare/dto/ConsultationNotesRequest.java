package com.telecare.dto;

import lombok.Data;

@Data
public class ConsultationNotesRequest {
    private String notes;
    private String diagnosis;
    private String prescriptionSummary;
    private String status; // IN_PROGRESS, COMPLETED
}
