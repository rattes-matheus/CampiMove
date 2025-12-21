package com.campimove.backend.dtos;

public record BusDTO(
        Long id,
        String plate,
        String company,
        Integer capacity,
        String model,
        Integer year,
        Boolean active,
        Long driverId,
        String driverName
) {}