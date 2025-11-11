package com.campimove.backend.controllers;

import com.campimove.backend.dtos.RegisterTransportDTO;
import com.campimove.backend.entities.Transport;
import com.campimove.backend.repositories.TransportRepository;
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
