package com.campimove.backend.controllers;

import com.campimove.backend.dtos.TravelRatingDTO;
import com.campimove.backend.entities.TravelRating;
import com.campimove.backend.repositories.TravelRatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rating")
public class RatingController {

    @Autowired
    private TravelRatingRepository repository;

    @PostMapping
    public void setRating(@RequestBody TravelRatingDTO formData) {
        repository.save(new TravelRating(formData.motoristName(), formData.rating()));
    }

    @GetMapping
    public ResponseEntity<List<TravelRating>> getRating() {
        return ResponseEntity.ok().body(repository.findAll());
    }

}
