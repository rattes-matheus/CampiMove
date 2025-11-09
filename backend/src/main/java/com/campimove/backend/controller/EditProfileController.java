package com.campimove.backend.controller;

import com.campimove.backend.dto.EditProfileDTO;
import com.campimove.backend.dto.UserResponseDTO;
import com.campimove.backend.entity.User;
import com.campimove.backend.service.EditProfileService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
    public ResponseEntity<User> updateProfile(
            @PathVariable Long userId,
            @RequestPart(value = "profileData", required = false) EditProfileDTO dto,
            @RequestPart(value = "profileImage", required = false) MultipartFile file
    ) {
        try {
            User updatedUser = editProfileService.updateUserProfile(userId, dto, file);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}