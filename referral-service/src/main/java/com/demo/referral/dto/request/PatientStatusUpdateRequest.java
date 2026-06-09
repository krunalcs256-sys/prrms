package com.demo.referral.dto.request;

import java.util.List;

public record PatientStatusUpdateRequest(List<Long> patientIds, String status) {}