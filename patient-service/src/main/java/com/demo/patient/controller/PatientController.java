package com.demo.patient.controller;

import com.demo.patient.dto.request.BatchStatusRequest;
import com.demo.patient.dto.request.PatientRequest;
import com.demo.patient.dto.response.ApiResponse;
import com.demo.patient.dto.response.PatientResponse;
import com.demo.patient.enums.Department;
import com.demo.patient.enums.PatientStatus;
import com.demo.patient.security.UserPrincipal;
import com.demo.patient.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<Page<PatientResponse>>> getPatients(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) Department department,
            @RequestParam(required = false) PatientStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Page<PatientResponse> result = patientService.getPatients(
                principal.getUserId(), name, fromDate, toDate, department, status, page, size
        );
        return ResponseEntity.ok(ApiResponse.success(result, "Patients fetched successfully"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<PatientResponse>> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(patientService.getPatientById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<PatientResponse>> createPatient(
            @Valid @RequestBody PatientRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        PatientResponse result = patientService.createPatient(request, principal.getUserId(), principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(result, "Patient created successfully"));
    }

    // Internal endpoint called by Referral Service to fetch patients by IDs
    @PostMapping("/batch/by-ids")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<List<PatientResponse>>> getPatientsByIds(
            @RequestBody List<Long> ids
    ) {
        return ResponseEntity.ok(ApiResponse.success(patientService.getPatientsByIds(ids)));
    }

    // Internal endpoint called by Referral Service to update patient statuses
    @PatchMapping("/batch/status")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<Void>> updatePatientsStatus(
            @Valid @RequestBody BatchStatusRequest request
    ) {
        patientService.updatePatientsStatus(request.patientIds(), request.status());
        return ResponseEntity.ok(ApiResponse.success(null, "Patient statuses updated"));
    }
}