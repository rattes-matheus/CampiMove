package com.campimove.backend.dtos;

import com.campimove.backend.enums.Role;

public record ChatUserResponseDTO (Long id, Role role, String profilePictureURL, String name) { }
