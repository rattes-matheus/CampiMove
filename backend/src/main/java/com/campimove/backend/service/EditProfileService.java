package com.campimove.backend.service;

import com.campimove.backend.dto.EditProfileDTO;
import com.campimove.backend.entity.User;
import com.campimove.backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class EditProfileService {

    private final UserRepository userRepository;
    private final Path fileStorageLocation = Paths.get("uploads/profile-pics").toAbsolutePath().normalize();

    public EditProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Não foi possível criar o diretório para salvar os arquivos.", ex);
        }
    }

    @Transactional
    public User updateUserProfile(Long userId, EditProfileDTO dto, MultipartFile file) {
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + userId));

        if (dto != null) {
            if (dto.name() != null && !dto.name().isBlank()) {
                user.setName(dto.name());
            }
            if (dto.email() != null && !dto.email().isBlank()) {
                user.setEmail(dto.email());
            }
        }

        if (file != null && !file.isEmpty()) {
            String fileName = saveFile(file);
            String fileAccessUrl = "/uploads/profile-pics/" + fileName;
            user.setProfilePictureUrl(fileAccessUrl); 
        }

        return userRepository.save(user);
    }

    private String saveFile(MultipartFile file) {
        String fileExtension = file.getOriginalFilename() != null && file.getOriginalFilename().contains(".") ? 
                              file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")) : "";
        String fileName = UUID.randomUUID().toString() + fileExtension;
        
        Path targetLocation = this.fileStorageLocation.resolve(fileName);
        
        try {
            Files.copy(file.getInputStream(), targetLocation);
            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Não foi possível salvar o arquivo " + fileName, ex);
        }
    }

    public User findUserById(Long userId) {
        return userRepository.findById(userId)
                             .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + userId));
    }
}