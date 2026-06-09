package com.demo.patient.dto.request;

import com.demo.patient.enums.Department;
import com.demo.patient.enums.Gender;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record PatientRequest(
        @NotBlank @Pattern(regexp = "\\d{10}", message = "UHID must be exactly 10 digits") String uhid,
        @NotBlank String name,
        @NotNull @Min(0) @Max(150) Integer age,
        @NotNull Gender gender,
        @NotBlank String encounterId,
        @NotNull Department department,
        @NotNull LocalDate appointmentDate
) {}