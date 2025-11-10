package com.campimove.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campimove.backend.dto.IntercampiRoutesFormDTO;
import com.campimove.backend.entities.IntercampiRoute.IntercampiRoute;
import com.campimove.backend.entities.IntercampiRoute.IntercampiRouteRepository;

@RestController
@RequestMapping("/api/routes")
public class IntercampiRouteController {
    
    @Autowired
    private IntercampiRouteRepository repository;

    @PostMapping
    public ResponseEntity<String> create(@RequestBody IntercampiRoutesFormDTO formData) {
        repository.save(new IntercampiRoute(formData.route(), formData.schedule()));
        return ResponseEntity.ok("Route created with success");
    }

    @GetMapping
    public ResponseEntity<List<IntercampiRoute>> get() {
        return ResponseEntity.ok(repository.findAll());
    }

}
