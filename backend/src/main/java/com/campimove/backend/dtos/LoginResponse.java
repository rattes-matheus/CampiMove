package com.campimove.backend.dtos;

import com.campimove.backend.entities.Role;

public record LoginResponse(String token, Role role) {
}
