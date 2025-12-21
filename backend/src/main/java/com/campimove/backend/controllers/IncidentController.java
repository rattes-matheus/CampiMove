package com.campimove.backend.controllers;

import com.campimove.backend.dtos.IncidentRequestDTO;
import com.campimove.backend.dtos.IncidentResponseDTO;
import com.campimove.backend.services.IncidentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/incidents")
public class IncidentController {
    @Autowired
    private IncidentService incidentService;

    @PostMapping("/post")
    public ResponseEntity<String> createIncident(@RequestBody @Valid IncidentRequestDTO formData) {

        incidentService.createIncident(formData);
        return ResponseEntity.status(201).body("Reported successfuly!");
    }

    @GetMapping
    public ResponseEntity<List<IncidentResponseDTO>> getAllIncidents() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponseDTO> getIncidentById(@PathVariable Long id) {
        try {
            IncidentResponseDTO response = incidentService.getIncidentDetails(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

}