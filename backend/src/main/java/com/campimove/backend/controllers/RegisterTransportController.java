package com.campimove.backend.controller;

import com.campimove.backend.dto.RegisterTransportDTO;
import com.campimove.backend.entities.transport.Transport;
import com.campimove.backend.entities.transport.TransportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/register-transport")
public class RegisterTransportController {
    @Autowired
    private TransportRepository repository;

    @PostMapping
    public ResponseEntity<String> Register(@RequestBody RegisterTransportDTO formData){
        repository.save(new Transport(formData.type(), formData.model(), formData.contact(), formData.capacity()));
        return ResponseEntity.status(201).body("Transport registered successfully");
    }
}
