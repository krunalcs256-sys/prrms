package com.demo.referral.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record PatientDto(
        Long id,
        String uhid,
        String name,
        Integer age,
        String gender,
        String encounterId,
        String department,
        Long assignedDoctorId,
        LocalDate appointmentDate,
        String status,
        LocalDateTime createdAt
) {}