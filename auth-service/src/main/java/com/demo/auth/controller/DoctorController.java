package com.demo.auth.controller;

import com.demo.auth.dto.response.ApiResponse;
import com.demo.auth.dto.response.DoctorResponse;
import com.demo.auth.enums.Role;
import com.demo.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getDoctors() {
        List<DoctorResponse> doctors = userRepository.findByRole(Role.DOCTOR)
                .stream()
                .map(DoctorResponse::from)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(doctors, "Doctors fetched successfully"));
    }
}