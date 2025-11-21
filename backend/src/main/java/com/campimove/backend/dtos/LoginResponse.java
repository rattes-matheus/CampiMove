package com.campimove.backend.dtos;

import com.campimove.backend.enums.Role;

public record LoginResponse(String token, Role role) {
}
