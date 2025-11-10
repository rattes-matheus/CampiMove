package com.campimove.backend.services;

import com.campimove.backend.entities.EmailVerification;
import com.campimove.backend.repositories.EmailVerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;
    private final EmailVerificationRepository emailVerificationRepository;

    public void sendVerificationEmail(String email) {
        String code = String.format("%06d", new SecureRandom().nextInt(1000000));

        EmailVerification verification = new EmailVerification();
        verification.setEmail(email);
        verification.setCode(code);
        verification.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        emailVerificationRepository.save(verification);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Codigo de verificacao - CampiMove");
        message.setText(code);

        javaMailSender.send(message);
    }
}
