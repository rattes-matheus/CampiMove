package com.campimove.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.campimove.backend.dto.IntercampiRouteFormDTO;
import com.campimove.backend.entity.IntercampiRoute;
import com.campimove.backend.repository.IntercampiRouteRepository;

@RestController
@RequestMapping("/api/routes")
public class IntercampiRouteController {

    @Autowired
    private IntercampiRouteRepository repository;

    @PostMapping("/save")
    public ResponseEntity<String> saveOrDelete(@RequestBody IntercampiRouteFormDTO data) {
        try {
            if (data.id() != null && data.route() == null && data.schedule() == null) {
                // se veio só o id → deletar
                repository.deleteById(data.id());
                return ResponseEntity.ok("Route deleted successfully!");
            } else if (data.route() != null && data.schedule() != null) {
                // se veio route e schedule → criar
                repository.save(new IntercampiRoute(data.route(), data.schedule()));
                return ResponseEntity.ok("Route created successfully!");
            } else {
                return ResponseEntity.badRequest().body("Invalid data: missing fields.");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<IntercampiRoute>> getAll() {
        return ResponseEntity.ok(repository.findAll());
    }
}

