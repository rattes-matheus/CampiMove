package com.campimove.backend.controller;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.campimove.backend.dto.IntercampiRouteFormDTO;
import com.campimove.backend.entity.IntercampiRoute;
import com.campimove.backend.repository.IntercampiRouteRepository;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "http://localhost:3000") // Adicione esta linha
public class IntercampiRouteController {

    @Autowired
    private IntercampiRouteRepository repository;

    @PostMapping("/save")
    public ResponseEntity<?> saveOrDelete(@RequestBody IntercampiRouteFormDTO data) {
        try {
            if (data.id() != null && data.route() == null && data.schedule() == null) {
                // se veio só o id → deletar
                repository.deleteById(data.id());
                return ResponseEntity.ok().body("Route deleted successfully!");
            } else if (data.route() != null && data.schedule() != null) {
                // se veio route e schedule → criar ou atualizar
                IntercampiRoute route;

                if (data.id() != null) {
                    // Atualizar existente
                    route = repository.findById(data.id()).orElseThrow();
                    route.setRoute(data.route());
                    route.setSchedule(data.schedule());
                } else {
                    // Criar novo
                    route = new IntercampiRoute(data.route(), data.schedule());
                }

                IntercampiRoute saved = repository.save(route);
                return ResponseEntity.ok(saved); // Retorna o objeto salvo
            } else {
                return ResponseEntity.badRequest().body("Invalid data: missing fields.");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<String> deleteRoute(@RequestBody DeleteRequest request) {
        try {
            repository.deleteById(request.id());
            return ResponseEntity.ok("Route deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<IntercampiRoute>> getAll() {
        return ResponseEntity.ok(repository.findAll());
    }

    // Classe auxiliar para a requisição de delete
    record DeleteRequest(Long id) {}
}