package com.campimove.backend.dtos;

import jakarta.validation.constraints.NotBlank;

public record AdminNotificationsDTO(@NotBlank String title, @NotBlank String message) {}
