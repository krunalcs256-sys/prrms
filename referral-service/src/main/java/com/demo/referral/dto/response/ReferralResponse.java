package com.demo.referral.dto.response;

import com.demo.referral.entity.Referral;

import java.time.LocalDateTime;

public record ReferralResponse(
        Long id,
        Long sourceDoctorId,
        String sourceDoctorName,
        Long targetDoctorId,
        String targetDoctorName,
        Long patientId,
        String patientName,
        String patientUhid,
        String encounterId,
        String remarks,
        String priority,
        String status,
        LocalDateTime createdAt
) {
    public static ReferralResponse from(Referral r) {
        return new ReferralResponse(
                r.getId(),
                r.getSourceDoctorId(),
                r.getSourceDoctorName(),
                r.getTargetDoctorId(),
                r.getTargetDoctorName(),
                r.getPatientId(),
                r.getPatientName(),
                r.getPatientUhid(),
                r.getEncounterId(),
                r.getRemarks(),
                r.getPriority().name(),
                r.getStatus().name(),
                r.getCreatedAt()
        );
    }
}