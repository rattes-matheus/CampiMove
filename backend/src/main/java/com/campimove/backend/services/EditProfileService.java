package com.campimove.backend.services;

import com.campimove.backend.dto.EditProfileDTO;
import com.campimove.backend.entities.User;
import com.campimove.backend.repositories.UserRepository;

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
        User user = findUserById(userId);
        
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("O arquivo de imagem está vazio ou ausente.");
        }

        String fileName = saveFile(file);
        String fileAccessUrl = "/uploads/profile-pics/" + fileName; 
        user.setProfilePictureUrl(fileAccessUrl); 

        return userRepository.save(user);
    }
    
    private String saveFile(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
             originalFilename = "file";
        }

        String fileExtension = originalFilename.contains(".") ? 
                               originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
        String fileName = UUID.randomUUID() + fileExtension;
        
        Path targetLocation = this.fileStorageLocation.resolve(fileName);
        
        try {
            Files.copy(file.getInputStream(), targetLocation);
            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Não foi possível salvar o arquivo " + fileName, ex);
        }
    }
}