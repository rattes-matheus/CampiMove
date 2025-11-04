package com.campimove.backand.services;

import java.io.IOException;
import java.util.Optional;
import com.campimove.backand.dtos.EditProfileDTO;
import com.campimove.backand.entities.User;
import com.campimove.backand.entities.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

        MultipartFile imagem = dto.getImagem();
        if (imagem != null && !imagem.isEmpty()) {
            String nomeArquivo = System.currentTimeMillis() + "_" + imagem.getOriginalFilename();
            String caminho = "uploads/" + nomeArquivo;
            imagem.transferTo(new java.io.File(caminho));

            user.setImagemUrl(caminho); 
        }

        return userRepository.save(user);
    }
}