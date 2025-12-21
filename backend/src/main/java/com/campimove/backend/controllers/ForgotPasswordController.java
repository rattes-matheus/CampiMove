package com.campimove.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import com.campimove.backend.services.ForgotPasswordService;
import com.campimove.backend.dtos.ForgotPasswordRequest;

@RestController
@RequestMapping("/api/forgot-password")
public class ForgotPasswordController {
  @Autowired
  private ForgotPasswordService forgotPasswordService;

  @PostMapping
  public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
    forgotPasswordService.requestPasswordReset(request.email());
    return ResponseEntity.ok("Link para redefinição de senha enviado para o email fornecido.");
  }
}
