package com.campimove.backend.services;

import com.campimove.backend.repositories.ForgotPasswordRepository;
import com.campimove.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.campimove.backend.entities.ForgotPassword;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ForgotPasswordService {
  @Autowired
  private ForgotPasswordRepository forgotPasswordRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private EmailService emailService;

  public void requestPasswordReset(String email) {
    var user = userRepository.findByEmail(email);
    if (user == null)
      throw new RuntimeException("Usuario nao encontrado");

    var token = UUID.randomUUID().toString();

    ForgotPassword reset = new ForgotPassword();
    reset.setEmail(email);
    reset.setToken(token);
    reset.setExpiresAt(LocalDateTime.now().plusMinutes(30));

    forgotPasswordRepository.save(reset);
    String link = "http://localhost:3000/reset-password?token=" + token;
    emailService.sendPasswordResetEmail(email, link);
  }
}
