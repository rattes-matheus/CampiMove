package com.campimove.backend.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record RateTransportRequestDTO(
        @NotNull
        @Min(1)
        @Max(5)
        Integer rating,
        String review
) {}