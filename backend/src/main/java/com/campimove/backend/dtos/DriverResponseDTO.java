package com.campimove.backend.dtos;

public record DriverResponseDTO(
        Long id,
        String name,
        String email,
        String phone,
        String licenseNumber,
        Double rating,
        String profilePictureUrl,
        Boolean active
) {}