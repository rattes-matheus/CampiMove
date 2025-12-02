package com.campimove.backend.controllers;

import com.campimove.backend.dtos.RegisterUserRequest;
import com.campimove.backend.entities.EmailVerification;
import com.campimove.backend.entities.User;
import com.campimove.backend.mappers.UserMapper;
import com.campimove.backend.repositories.EmailVerificationRepository;
import com.campimove.backend.repositories.UserRepository;
import com.campimove.backend.services.EmailService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;

@RestController
@AllArgsConstructor
@RequestMapping("/register")
public class RegisterController {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final EmailVerificationRepository emailVerificationRepository;

    @PostMapping
    public ResponseEntity<?> registerUser(
            @RequestBody RegisterUserRequest request) {
        if (userRepository.existsByEmail(request.email())) return ResponseEntity.badRequest().body(Map.of("email", "Email em uso por outro usuario"));

        userRepository.save(new User(request.email(), passwordEncoder.encode(request.password()), request.role()));

        emailService.sendVerificationEmail(request.email());

        return ResponseEntity.status(201).build();
    }

}
