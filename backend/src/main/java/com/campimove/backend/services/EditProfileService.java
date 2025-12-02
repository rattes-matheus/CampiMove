package com.campimove.backend.services;

import com.campimove.backend.dtos.EditProfileDTO;
import com.campimove.backend.entities.User;
import com.campimove.backend.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class EditProfileService {

    private final UserRepository userRepository;
    private final Path fileStorageLocation = Paths.get("uploads/profile-pics")
            .toAbsolutePath()
            .normalize();

    public EditProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Não foi possível criar o diretório de upload.", ex);
        }
    }

    public User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + userId));
    }

    @Transactional
    public User updateUserProfileData(Long userId, EditProfileDTO dto) {
        User user = findUserById(userId);
        if (dto != null) {
            if (dto.name() != null && !dto.name().isBlank()) {
                user.setName(dto.name());
            }
            if (dto.email() != null && !dto.email().isBlank()) {
                user.setEmail(dto.email());
            }
        }
        return userRepository.save(user);
    }

    @Transactional
    public User updateUserProfilePicture(Long userId, MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("A imagem enviada está vazia.");
        }

        // Valida tipo
        if (!file.getContentType().startsWith("image/")) {
            throw new RuntimeException("O arquivo não é uma imagem válida.");
        }

        User user = findUserById(userId);

        // Apaga imagem antiga
        if (user.getProfilePictureUrl() != null) {
            deleteOldFile(user.getProfilePictureUrl());
        }

        String fileName = saveFile(file);

        user.setProfilePictureUrl("/uploads/profile-pics/" + fileName);

        return userRepository.save(user);
    }

    private void deleteOldFile(String url) {
        String fileName = Paths.get(url).getFileName().toString();
        Path oldFile = this.fileStorageLocation.resolve(fileName);

        try {
            Files.deleteIfExists(oldFile);
        } catch (IOException ignored) {
        }
    }

    private String saveFile(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            originalFilename = "file";
        }


        String extension = originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";

        String fileName = UUID.randomUUID().toString() + extension;

        Path targetLocation = fileStorageLocation.resolve(fileName);

        try {
            Files.createDirectories(fileStorageLocation);
            Files.copy(
                    file.getInputStream(),
                    targetLocation,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return fileName;

        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar arquivo: " + e.getMessage(), e);
        }
    }

}