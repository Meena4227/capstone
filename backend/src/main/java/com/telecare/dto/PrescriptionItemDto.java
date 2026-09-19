package com.telecare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionItemDto {
    private String medicineName;
    private String dosage;
    private String frequency;
    private String duration;
}
