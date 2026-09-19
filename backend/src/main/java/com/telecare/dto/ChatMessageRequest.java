package com.telecare.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatMessageRequest {
    @NotBlank
    private String content;

    private String senderRole; // DOCTOR, PATIENT
    private String senderName;
}
