package com.campimove.backend.controllers;

import com.campimove.backend.entities.User;
import com.campimove.backend.repositories.UserRepository;
import com.campimove.backend.services.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtService jwtService;

    @Autowired
    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getAuthenticatedUser(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return ResponseEntity.status(401).build();

        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);

        User user = userRepository.findByEmail(email);

        if (user == null) return ResponseEntity.status(401).build();

        String profilePictureURL = user.getProfilePictureUrl() == null ? "" : user.getProfilePictureUrl();

        return ResponseEntity.ok(
                Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "role", user.getRole().name(),
                        "name", user.getName(),
                        "profilePictureURL", profilePictureURL
                )
        );
    }
}
