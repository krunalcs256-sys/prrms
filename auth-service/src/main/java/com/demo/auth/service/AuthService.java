package com.demo.auth.service;

import com.demo.auth.dto.request.LoginRequest;
import com.demo.auth.dto.request.RegisterRequest;
import com.demo.auth.dto.response.AuthResponse;
import com.demo.auth.entity.User;
import com.demo.auth.exception.BusinessException;
import com.demo.auth.repository.UserRepository;
import com.demo.auth.security.JwtService;
import com.demo.auth.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException("User not found", HttpStatus.NOT_FOUND));
        String token = jwtService.generateToken(UserPrincipal.of(user));
        return buildResponse(token, user);
    }


    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email already registered", HttpStatus.CONFLICT);
        }
        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role())
                .department(request.department())
                .build();
        user = userRepository.save(user);
        String token = jwtService.generateToken(UserPrincipal.of(user));
        return buildResponse(token, user);
    }

    private AuthResponse buildResponse(String token, User user) {
        return AuthResponse.of(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getDepartment() != null ? user.getDepartment().name() : null
        );
    }
}