package com.demo.referral.dto.request;

import com.demo.referral.enums.Priority;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record BulkReferralRequest(
        @NotNull Long targetDoctorId,
        @NotNull String targetDoctorName,
        @NotEmpty @Size(max = 500) List<Long> patientIds,
        @NotNull Priority priority,
        String remarks
) {}