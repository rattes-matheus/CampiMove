package com.campimove.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.campimove.backend.dto.IntercampiRouteFormDTO;
import com.campimove.backend.entity.IntercampiRoute;
import com.campimove.backend.repository.IntercampiRouteRepository;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "http://localhost:3000")
public class IntercampiRouteController {

    @Autowired
    private IntercampiRouteRepository repository;

    @PostMapping("/save")
    public ResponseEntity<?> saveOrDelete(@RequestBody IntercampiRouteFormDTO data) {
        try {
            if (data.id() != null && data.route() == null && data.schedule() == null) {
                repository.deleteById(data.id());
                return ResponseEntity.ok("Route deleted successfully!");
            } else if (data.route() != null && data.schedule() != null) {
                IntercampiRoute route = new IntercampiRoute(data.route(), data.schedule());
                IntercampiRoute savedRoute = repository.save(route);
                return ResponseEntity.ok(savedRoute);
            } else {
                return ResponseEntity.badRequest().body("Invalid data: missing fields.");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateRoute(
            @PathVariable Long id,
            @RequestBody IntercampiRouteFormDTO data) {
        try {
            Optional<IntercampiRoute> optionalRoute = repository.findById(id);

            if (optionalRoute.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            IntercampiRoute route = optionalRoute.get();

            if (data.route() != null) {
                route.setRoute(data.route());
            }

            if (data.schedule() != null) {
                route.setSchedule(data.schedule());
            }

            IntercampiRoute updatedRoute = repository.save(route);
            return ResponseEntity.ok(updatedRoute);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-all")
    public ResponseEntity<String> deleteAllRoutes() {
        try {
            repository.deleteAll();
            return ResponseEntity.ok("All routes deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<String> deleteRoute(@RequestBody DeleteRequest request) {
        try {
            repository.deleteById(request.getId());
            return ResponseEntity.ok("Route deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<IntercampiRoute>> getAll() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Optional<IntercampiRoute> route = repository.findById(id);
        return route.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Classe auxiliar para a requisição de delete usando Lombok
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeleteRequest {
        private Long id;
    }
}