package com.campimove.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AdminNotificationsDTO(
        @NotBlank String title,
        @NotBlank String message,
        @NotNull Integer programmedTime,
        @NotBlank String timeUnit
        )
{}
