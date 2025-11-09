package com.campimove.backend.controller;

import com.campimove.backend.entity.User;
import com.campimove.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Usuário não encontrado");
        }

        User user = userOpt.get();

        return ResponseEntity.ok(new LoginResponse(user.getId(), user.getNome(), user.getEmail()));
    }

    static class LoginResponse {
        public Long userId;
        public String nome;
        public String email;

        public LoginResponse(Long userId, String nome, String email) {
            this.userId = userId;
            this.nome = nome;
            this.email = email;
        }
    }
}
