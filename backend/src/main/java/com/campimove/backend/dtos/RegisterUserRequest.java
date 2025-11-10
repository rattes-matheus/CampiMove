package com.campimove.backend.dtos;

import com.campimove.backend.entities.Role;

public record RegisterUserRequest(String email, String password, Role role) {
}
