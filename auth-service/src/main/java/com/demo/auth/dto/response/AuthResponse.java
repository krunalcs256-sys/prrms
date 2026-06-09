package com.demo.auth.dto.response;

public record AuthResponse(
        String token,
        Long userId,
        String name,
        String email,
        String role,
        String department
) {
    public static AuthResponse of(String token, Long userId, String name, String email, String role, String department) {
        return new AuthResponse(token, userId, name, email, role, department);
    }
}