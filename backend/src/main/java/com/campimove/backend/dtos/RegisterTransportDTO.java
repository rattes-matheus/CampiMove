package com.campimove.backend.dtos;

import com.campimove.backend.enums.TransportTypes;

public record RegisterTransportDTO(TransportTypes type, String model, Long capacity, String contact, String motorist) {}
