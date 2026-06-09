package com.demo.referral.dto.response;

import com.demo.referral.entity.Notification;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        String message,
        Long referralId,
        boolean isRead,
        LocalDateTime createdAt
) {
    public static NotificationResponse from(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getMessage(),
                n.getReferral() != null ? n.getReferral().getId() : null,
                n.isRead(),
                n.getCreatedAt()
        );
    }
}