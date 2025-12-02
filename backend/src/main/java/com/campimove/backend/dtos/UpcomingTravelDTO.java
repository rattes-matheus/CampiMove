package com.campimove.backend.dtos;

public record UpcomingTravelDTO(
        String motoristName,
        String origin,
        String destination,
        String schedule
) {}