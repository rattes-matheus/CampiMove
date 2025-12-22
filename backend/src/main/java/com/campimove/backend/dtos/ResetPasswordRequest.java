package com.campimove.backend.dtos;

public record ResetPasswordRequest(String token, String newPassword) {
}
