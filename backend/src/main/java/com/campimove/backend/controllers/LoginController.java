package com.campimove.backend.controllers;

import com.campimove.backend.dtos.LoginUserRequest;
import com.campimove.backend.entities.User;
import com.campimove.backend.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/login")
public class LoginController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginUserRequest request) {
        User user = userRepository.findByEmail(request.email());

        if (user == null) return ResponseEntity.status(401).body(Map.of("error", "Email invalido"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) return ResponseEntity.status(401).body(Map.of("error", "Email ou senha incorretos"));

        return ResponseEntity.ok(Map.of("message", "Login realizado com sucesso", "role", user.getRole()));
    }
}
