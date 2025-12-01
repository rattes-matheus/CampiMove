package com.campimove.backend.dtos;

import com.campimove.backend.enums.Role;

public record RegisterUserRequest(String email, String password, Role role) {
}
