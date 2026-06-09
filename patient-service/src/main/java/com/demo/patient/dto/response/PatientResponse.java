package com.demo.patient.dto.response;

import com.demo.patient.entity.Patient;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record PatientResponse(
        Long id,
        String uhid,
        String name,
        Integer age,
        String gender,
        String encounterId,
        String department,
        Long assignedDoctorId,
        String assignedDoctorName,
        LocalDate appointmentDate,
        String status,
        LocalDateTime createdAt
) {
    public static PatientResponse from(Patient p) {
        return new PatientResponse(
                p.getId(),
                p.getUhid(),
                p.getName(),
                p.getAge(),
                p.getGender().name(),
                p.getEncounterId(),
                p.getDepartment().name(),
                p.getAssignedDoctorId(),
                p.getAssignedDoctorName(),
                p.getAppointmentDate(),
                p.getStatus().name(),
                p.getCreatedAt()
        );
    }
}