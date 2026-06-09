package com.demo.referral.entity;

import com.demo.referral.enums.Priority;
import com.demo.referral.enums.ReferralStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "referrals")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Referral {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long sourceDoctorId;

    @Column(nullable = false)
    private String sourceDoctorName;

    @Column(nullable = false)
    private Long targetDoctorId;

    @Column(nullable = false)
    private String targetDoctorName;

    @Column(nullable = false)
    private Long patientId;

    @Column(nullable = false)
    private String patientName;

    @Column(nullable = false, length = 10)
    private String patientUhid;

    @Column(nullable = false)
    private String encounterId;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReferralStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = ReferralStatus.PENDING_REVIEW;
    }
}