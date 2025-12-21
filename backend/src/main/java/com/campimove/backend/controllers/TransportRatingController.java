package com.campimove.backend.controllers;

import com.campimove.backend.dtos.RateTransportRequestDTO;
import com.campimove.backend.dtos.TransportRatingResponseDTO;
import com.campimove.backend.dtos.TransportWithRatingsDTO;
import com.campimove.backend.services.TransportRatingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transports")
public class TransportRatingController {

    @Autowired
    private TransportRatingService transportRatingService;

    @PostMapping("/{transportId}/rate")
    public ResponseEntity<TransportRatingResponseDTO> rateTransport(
            @PathVariable Long transportId,
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody RateTransportRequestDTO request) {
        return ResponseEntity.ok(transportRatingService.rateTransport(transportId, userId, request));
    }

    @GetMapping("/{transportId}/ratings")
    public ResponseEntity<List<TransportRatingResponseDTO>> getRatingsByTransportId(@PathVariable Long transportId) {
        return ResponseEntity.ok(transportRatingService.getRatingsByTransportId(transportId));
    }

    @GetMapping("/{transportId}/average-rating")
    public ResponseEntity<Double> getAverageRatingByTransportId(@PathVariable Long transportId) {
        return ResponseEntity.ok(transportRatingService.getAverageRatingByTransportId(transportId));
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<TransportWithRatingsDTO>> getTopRatedTransports() {
        return ResponseEntity.ok(transportRatingService.getTopRatedTransports());
    }

    @GetMapping("/user/{userId}/ratings")
    public ResponseEntity<List<TransportRatingResponseDTO>> getRatingsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(transportRatingService.getRatingsByUserId(userId));
    }
}