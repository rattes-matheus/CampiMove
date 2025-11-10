package com.campimove.backend.controllers;

import com.campimove.backend.dtos.VerifyCodeDto;
import com.campimove.backend.entities.EmailVerification;
import com.campimove.backend.entities.User;
import com.campimove.backend.repositories.EmailVerificationRepository;
import com.campimove.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/verify-code")
@RequiredArgsConstructor
public class VerificationController {
    private final UserRepository userRepository;
    private final EmailVerificationRepository emailVerificationRepository;

    @PostMapping
    public ResponseEntity<?> verifyCode(@RequestBody VerifyCodeDto verifyCodeDto) {
        String email = verifyCodeDto.email();
        String code = verifyCodeDto.code();

        EmailVerification verification = emailVerificationRepository.findByEmail(email);

        if (verification == null) return ResponseEntity.badRequest().body("Codigo de verificacao nao encontrado");
        if (!verification.getCode().equals(code)) return  ResponseEntity.badRequest().body("Codigo incorreto");
        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) return ResponseEntity.badRequest().body("Codigo expirado");

        User user = userRepository.findByEmail(email);

        if (user == null) return ResponseEntity.badRequest().body("Usuario nao encontrado");

        user.setVerified(true);
        userRepository.save(user);

        emailVerificationRepository.delete(verification);

        return ResponseEntity.ok("Email verificado");
    }
}
