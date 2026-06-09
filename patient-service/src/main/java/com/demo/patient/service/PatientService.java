package com.demo.patient.service;

import com.demo.patient.dto.request.PatientRequest;
import com.demo.patient.dto.response.PatientResponse;
import com.demo.patient.entity.Patient;
import com.demo.patient.enums.Department;
import com.demo.patient.enums.PatientStatus;
import com.demo.patient.exception.BusinessException;
import com.demo.patient.repository.PatientRepository;
import com.demo.patient.specification.PatientSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    @Transactional(readOnly = true)
    public Page<PatientResponse> getPatients(
            Long doctorId, String name, LocalDate fromDate, LocalDate toDate,
            Department department, PatientStatus status, int page, int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appointmentDate").descending());
        return patientRepository.findAll(
                PatientSpecification.filter(doctorId, name, fromDate, toDate, department, status),
                pageable
        ).map(PatientResponse::from);
    }

    @Transactional(readOnly = true)
    public PatientResponse getPatientById(Long id) {
        return patientRepository.findById(id)
                .map(PatientResponse::from)
                .orElseThrow(() -> new BusinessException("Patient not found", HttpStatus.NOT_FOUND));
    }

    @Transactional
    public PatientResponse createPatient(PatientRequest request, Long doctorId, String doctorName) {
        if (patientRepository.existsByUhid(request.uhid())) {
            throw new BusinessException("UHID already exists");
        }
        if (patientRepository.existsByEncounterId(request.encounterId())) {
            throw new BusinessException("Encounter ID already exists");
        }
        Patient patient = Patient.builder()
                .uhid(request.uhid())
                .name(request.name())
                .age(request.age())
                .gender(request.gender())
                .encounterId(request.encounterId())
                .department(request.department())
                .assignedDoctorId(doctorId)
                .assignedDoctorName(doctorName)
                .appointmentDate(request.appointmentDate())
                .status(PatientStatus.ACTIVE)
                .build();
        return PatientResponse.from(patientRepository.save(patient));
    }

    @Transactional(readOnly = true)
    public List<PatientResponse> getPatientsByIds(List<Long> ids) {
        return patientRepository.findAllById(ids).stream()
                .map(PatientResponse::from)
                .toList();
    }

    @Transactional
    public void updatePatientsStatus(List<Long> patientIds, PatientStatus status) {
        List<Patient> patients = patientRepository.findAllById(patientIds);
        patients.forEach(p -> p.setStatus(status));
        patientRepository.saveAll(patients);
    }
}