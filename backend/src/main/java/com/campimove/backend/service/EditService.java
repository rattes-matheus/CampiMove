package com.campimove.backend.service;

import java.io.IOException;
import java.util.Optional;

import com.campimove.backend.dto.EditProfileDTO;
import com.campimove.backend.entity.User;
import com.campimove.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EditService {

    @Autowired
    private UserRepository userRepository;

    public User atualizarPerfil(Long userId, EditProfileDTO dto) throws IOException {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado");
        }

        User user = optionalUser.get();

        if (dto.getNome() != null && !dto.getNome().isBlank()) {
            user.setNome(dto.getNome());
        }

        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            user.setEmail(dto.getEmail());
        }

        return userRepository.save(user);
    }

    public Optional<User> buscarPorId(Long id) {
        return userRepository.findById(id);
    }
}
