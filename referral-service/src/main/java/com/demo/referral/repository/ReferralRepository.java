package com.demo.referral.repository;

import com.demo.referral.entity.Referral;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReferralRepository extends JpaRepository<Referral, Long> {
    Page<Referral> findBySourceDoctorId(Long sourceDoctorId, Pageable pageable);
    Page<Referral> findByTargetDoctorId(Long targetDoctorId, Pageable pageable);
}