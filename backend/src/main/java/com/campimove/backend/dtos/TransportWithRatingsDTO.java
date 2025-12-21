package com.campimove.backend.dtos;

import com.campimove.backend.enums.TransportTypes;

public record TransportWithRatingsDTO(
        Long id,
        TransportTypes type,
        String model,
        Long capacity,
        String contact,
        boolean active,
        Double averageRating,
        Integer totalRatings
) {}