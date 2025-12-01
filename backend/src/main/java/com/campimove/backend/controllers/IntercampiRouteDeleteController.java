package com.campimove.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campimove.backend.dto.IntercampiRouteDeleteFormDTO;
import com.campimove.backend.entities.IntercampiRoute.IntercampiRouteRepository;

@RestController
@RequestMapping("/api/routes/delete")
public class IntercampiRouteDeleteController {
    
    @Autowired
    private IntercampiRouteRepository repository;

    @PostMapping
    public ResponseEntity<String> delete(@RequestBody IntercampiRouteDeleteFormDTO formData) {
        try {
            repository.deleteById(formData.id());
            return ResponseEntity.ok("Route deleted successful!");
        } catch(RuntimeException exception) {
            System.out.println("Can't delete the route : " + exception.getMessage());
            return ResponseEntity.internalServerError().body("Can't delete the route : " + exception.getMessage());
        }
    }

}
