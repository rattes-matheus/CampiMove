package com.campimove.backend.dtos;

import java.time.LocalDateTime;

public record TransportRatingResponseDTO(
        Long id,
        Long transportId,
        Long userId,
        String userName,
        Integer rating,
        String review,
        LocalDateTime createdAt
) {}