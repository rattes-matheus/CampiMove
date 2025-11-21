package com.campimove.backend.entities;

import com.campimove.backend.enums.TransportTypes;
import lombok.AllArgsConstructor;

public record Driver(Long id, Double rating, String profilePictureURL, TransportTypes transportType, String motorist) {
}
