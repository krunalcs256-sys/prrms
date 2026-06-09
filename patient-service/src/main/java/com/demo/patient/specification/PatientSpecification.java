package com.demo.patient.specification;

import com.demo.patient.entity.Patient;
import com.demo.patient.enums.Department;
import com.demo.patient.enums.PatientStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class PatientSpecification {

    public static Specification<Patient> filter(
            Long doctorId,
            String name,
            LocalDate fromDate,
            LocalDate toDate,
            Department department,
            PatientStatus status
    ) {
        return Specification
                .where(belongsToDoctor(doctorId))
                .and(nameLike(name))
                .and(appointmentDateFrom(fromDate))
                .and(appointmentDateTo(toDate))
                .and(hasDepatrment(department))
                .and(hasStatus(status));
    }

    private static Specification<Patient> belongsToDoctor(Long doctorId) {
        return (root, query, cb) ->
                doctorId == null ? null : cb.equal(root.get("assignedDoctorId"), doctorId);
    }

    private static Specification<Patient> nameLike(String name) {
        return (root, query, cb) ->
                name == null ? null : cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    private static Specification<Patient> appointmentDateFrom(LocalDate from) {
        return (root, query, cb) ->
                from == null ? null : cb.greaterThanOrEqualTo(root.get("appointmentDate"), from);
    }

    private static Specification<Patient> appointmentDateTo(LocalDate to) {
        return (root, query, cb) ->
                to == null ? null : cb.lessThanOrEqualTo(root.get("appointmentDate"), to);
    }

    private static Specification<Patient> hasDepatrment(Department department) {
        return (root, query, cb) ->
                department == null ? null : cb.equal(root.get("department"), department);
    }

    private static Specification<Patient> hasStatus(PatientStatus status) {
        return (root, query, cb) ->
                status == null ? null : cb.equal(root.get("status"), status);
    }
}