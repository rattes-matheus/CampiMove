package com.campimove.backend.service;

import com.campimove.backend.entity.User;
import com.campimove.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public Optional<User> login(String email, String senha) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            if ("admin".equals(senha)) {
                return Optional.of(user);
            }
        }

        return Optional.empty();
    }
}
