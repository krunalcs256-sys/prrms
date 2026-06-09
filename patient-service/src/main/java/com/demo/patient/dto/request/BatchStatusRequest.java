package com.demo.patient.dto.request;

import com.demo.patient.enums.PatientStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record BatchStatusRequest(
        @NotEmpty List<Long> patientIds,
        @NotNull PatientStatus status
) {}