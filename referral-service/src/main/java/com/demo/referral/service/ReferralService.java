package com.demo.referral.service;

import com.demo.referral.client.PatientServiceClient;
import com.demo.referral.dto.request.BulkReferralRequest;
import com.demo.referral.dto.request.ReferralStatusRequest;
import com.demo.referral.dto.response.BulkReferralResponse;
import com.demo.referral.dto.response.PatientDto;
import com.demo.referral.dto.response.ReferralResponse;
import com.demo.referral.entity.AuditLog;
import com.demo.referral.entity.Notification;
import com.demo.referral.entity.Referral;
import com.demo.referral.enums.PatientStatus;
import com.demo.referral.exception.BusinessException;
import com.demo.referral.repository.AuditLogRepository;
import com.demo.referral.repository.NotificationRepository;
import com.demo.referral.repository.ReferralRepository;
import com.demo.referral.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReferralService {

    private final ReferralRepository referralRepository;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;
    private final PatientServiceClient patientServiceClient;

    @Transactional
    public BulkReferralResponse createBulkReferrals(
            BulkReferralRequest request,
            UserPrincipal doctor,
            String bearerToken
    ) {
        if (request.patientIds().size() > 500) {
            throw new BusinessException("Bulk referral cannot exceed 500 patients per action");
        }
        if (request.targetDoctorId().equals(doctor.getUserId())) {
            throw new BusinessException("Cannot refer patients to yourself");
        }

        List<PatientDto> patients = patientServiceClient.getPatientsByIds(request.patientIds(), bearerToken);

        if (patients.size() != request.patientIds().size()) {
            throw new BusinessException("One or more patient IDs are invalid");
        }

        List<PatientDto> unauthorized = patients.stream()
                .filter(p -> !p.assignedDoctorId().equals(doctor.getUserId()))
                .toList();

        if (!unauthorized.isEmpty()) {
            throw new BusinessException("Not authorized to refer patient(s): " +
                    unauthorized.stream().map(PatientDto::name).toList());
        }

        LocalDateTime now = LocalDateTime.now();

        List<Referral> referrals = patients.stream()
                .map(p -> Referral.builder()
                        .sourceDoctorId(doctor.getUserId())
                        .sourceDoctorName(doctor.getName())
                        .targetDoctorId(request.targetDoctorId())
                        .targetDoctorName(request.targetDoctorName())
                        .patientId(p.id())
                        .patientName(p.name())
                        .patientUhid(p.uhid())
                        .encounterId(p.encounterId())
                        .remarks(request.remarks())
                        .priority(request.priority())
                        .createdAt(now)
                        .build())
                .toList();

        List<Referral> saved = referralRepository.saveAll(referrals);

        patientServiceClient.updatePatientStatuses(
                request.patientIds(), PatientStatus.REFERRED_FOR_REVIEW.name(), bearerToken
        );

        List<Notification> notifications = saved.stream()
                .map(r -> Notification.builder()
                        .recipientId(request.targetDoctorId())
                        .message(String.format(
                                "Dr. %s referred patient %s (UHID: %s) to you for review [%s priority]",
                                doctor.getName(), r.getPatientName(), r.getPatientUhid(), r.getPriority().name()))
                        .referral(r)
                        .isRead(false)
                        .createdAt(now)
                        .build())
                .toList();
        notificationRepository.saveAll(notifications);

        List<AuditLog> auditLogs = saved.stream()
                .map(r -> AuditLog.builder()
                        .action("BULK_REFERRAL_CREATED")
                        .performedBy(doctor.getUserId())
                        .targetEntity("Referral")
                        .targetId(r.getId())
                        .details(String.format(
                                "Dr. '%s' referred patient '%s' (UHID: %s) to Dr. '%s'",
                                doctor.getName(), r.getPatientName(), r.getPatientUhid(), request.targetDoctorName()))
                        .createdAt(now)
                        .build())
                .toList();
        auditLogRepository.saveAll(auditLogs);

        return new BulkReferralResponse(
                saved.size(),
                String.format("Successfully referred %d patient(s) to Dr. %s", saved.size(), request.targetDoctorName()),
                saved.stream().map(ReferralResponse::from).toList()
        );
    }

    @Transactional(readOnly = true)
    public Page<ReferralResponse> getOutgoingReferrals(Long doctorId, Pageable pageable) {
        return referralRepository.findBySourceDoctorId(doctorId, pageable).map(ReferralResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<ReferralResponse> getIncomingReferrals(Long doctorId, Pageable pageable) {
        return referralRepository.findByTargetDoctorId(doctorId, pageable).map(ReferralResponse::from);
    }

    @Transactional
    public ReferralResponse updateStatus(Long referralId, ReferralStatusRequest request, Long doctorId) {
        Referral referral = referralRepository.findById(referralId)
                .orElseThrow(() -> new BusinessException("Referral not found", HttpStatus.NOT_FOUND));

        if (!referral.getTargetDoctorId().equals(doctorId)) {
            throw new BusinessException("Only the target doctor can update referral status", HttpStatus.FORBIDDEN);
        }

        referral.setStatus(request.status());
        return ReferralResponse.from(referralRepository.save(referral));
    }
}