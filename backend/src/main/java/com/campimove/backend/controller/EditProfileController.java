package com.campimove.backend.controller;

import com.campimove.backend.dto.EditProfileDTO;
import com.campimove.backend.dto.UserResponseDTO;
import com.campimove.backend.entities.User;
import com.campimove.backend.service.EditProfileService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping; 
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody; 
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;


@RestController
@RequestMapping("/api/profile")
public class EditProfileController {

    private final EditProfileService editProfileService;

    public EditProfileController(EditProfileService editProfileService) {
        this.editProfileService = editProfileService;
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponseDTO> getUserProfile(@PathVariable Long userId) {
        User user = editProfileService.findUserById(userId); 
        
        UserResponseDTO responseDto = new UserResponseDTO(
            user.getId(), 
            user.getName(), 
            user.getEmail(), 
            user.getProfilePictureUrl() 
        );
        
        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserResponseDTO> updateProfileData(
        @PathVariable Long userId,
        @RequestBody EditProfileDTO dto 
    ) {
        try {
            User updatedUser = editProfileService.updateUserProfileData(userId, dto);
        
            UserResponseDTO responseDto = new UserResponseDTO(
                updatedUser.getId(), 
                updatedUser.getName(), 
                updatedUser.getEmail(), 
                updatedUser.getProfilePictureUrl()
            );
            
            return ResponseEntity.ok(responseDto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); 
        }
    }
    
    
    @PutMapping("/{userId}/picture") 
    public ResponseEntity<UserResponseDTO> updateProfilePicture(
        @PathVariable Long userId,
        @RequestPart("profileImage") MultipartFile file 
    ) {
        try {
            User updatedUser = editProfileService.updateUserProfilePicture(userId, file);
            
            UserResponseDTO responseDto = new UserResponseDTO(
                updatedUser.getId(), 
                updatedUser.getName(), 
                updatedUser.getEmail(), 
                updatedUser.getProfilePictureUrl()
            );

            return ResponseEntity.ok(responseDto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); 
        }
    }
}