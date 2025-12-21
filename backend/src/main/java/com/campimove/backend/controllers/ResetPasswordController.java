package com.campimove.backend.controllers;

import com.campimove.backend.repositories.ForgotPasswordRepository;
import com.campimove.backend.repositories.UserRepository;
import com.campimove.backend.dtos.ResetPasswordRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.campimove.backend.entities.ForgotPassword;
import com.campimove.backend.entities.User;

@RestController
@RequestMapping("/api/reset-password")
@RequiredArgsConstructor
public class ResetPasswordController {
  private final ForgotPasswordRepository forgotPasswordRepository;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @PostMapping
  public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
    ForgotPassword reset = forgotPasswordRepository.findByToken(request.token()).orElse(null);

    if (reset == null)
      return ResponseEntity.badRequest().body("Token invalido.");
    if (reset.isExpired())
      return ResponseEntity.badRequest().body("Token expirado.");

    User user = userRepository.findByEmail(reset.getEmail());
    if (user == null)
      return ResponseEntity.badRequest().body("Usuario nao encontrado.");

    user.setPassword(passwordEncoder.encode(request.newPassword()));
    userRepository.save(user);
    forgotPasswordRepository.delete(reset);

    return ResponseEntity.ok("Senha redefinida com sucesso.");
  }
}
