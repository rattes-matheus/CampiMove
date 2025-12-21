package com.campimove.backend.dtos;

import jakarta.validation.constraints.Min;

public record UpdateBusDTO(
        String plate,
        String company,
        @Min(1) Integer capacity,
        String model,
        @Min(1990) Integer year,
        Boolean active,
        Long driverId
) {}