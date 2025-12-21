package com.campimove.backend.controllers;

import com.campimove.backend.entities.Transport;
import com.campimove.backend.repositories.TransportRepository;
import com.campimove.backend.services.TransportRatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transports")
public class TransportController {

    @Autowired
    private TransportRepository transportRepository;

    @Autowired
    private TransportRatingService transportRatingService;

    @GetMapping
    public ResponseEntity<List<Transport>> getAllTransports() {
        List<Transport> transports = transportRepository.findAll();
        return ResponseEntity.ok(transports);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Transport>> getActiveTransports() {
        List<Transport> activeTransports = transportRepository.findAll()
                .stream()
                .filter(Transport::isActive)
                .toList();
        return ResponseEntity.ok(activeTransports);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transport> getTransportById(@PathVariable Long id) {
        Transport transport = transportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transporte não encontrado"));
        return ResponseEntity.ok(transport);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Transport>> getTransportsByType(@PathVariable String type) {
        List<Transport> transports = transportRepository.findAll()
                .stream()
                .filter(t -> t.getType().name().equalsIgnoreCase(type))
                .toList();
        return ResponseEntity.ok(transports);
    }
}