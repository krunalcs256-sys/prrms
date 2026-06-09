package com.demo.auth.dto.response;

import com.demo.auth.entity.User;

public record DoctorResponse(
        Long id,
        String name,
        String email,
        String department
) {
    public static DoctorResponse from(User user) {
        return new DoctorResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getDepartment() != null ? user.getDepartment().name() : null
        );
    }
}