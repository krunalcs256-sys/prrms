package com.demo.referral.client;

import com.demo.referral.dto.request.PatientStatusUpdateRequest;
import com.demo.referral.dto.response.ApiResponse;
import com.demo.referral.dto.response.PatientDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "patient-service", url = "${services.patient.url}")
public interface PatientServiceClient {

    @PostMapping("/api/patients/batch/by-ids")
    ApiResponse<List<PatientDto>> getPatientsByIds(
            @RequestHeader("Authorization") String bearerToken,
            @RequestBody List<Long> ids);

    @PatchMapping("/api/patients/batch/status")
    void updatePatientStatuses(
            @RequestHeader("Authorization") String bearerToken,
            @RequestBody PatientStatusUpdateRequest request);
}