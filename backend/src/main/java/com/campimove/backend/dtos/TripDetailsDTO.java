package com.campimove.backend.dtos;

public record TripDetailsDTO(
        String origin,
        String destination,
        String price,
        String schedule,
        String motoristPhone
) {}