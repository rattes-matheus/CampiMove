package com.campimove.backend.dtos;

public record TransportStatisticsDTO(
        Long totalTransports,
        Long activeTransports,
        Double averageRating,
        Long totalRatings
) {}