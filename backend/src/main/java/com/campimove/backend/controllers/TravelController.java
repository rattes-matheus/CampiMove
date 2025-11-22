package com.campimove.backend.controllers;

import com.campimove.backend.dtos.UpcomingTravelDTO;
import com.campimove.backend.services.TravelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/travels")
public class TravelController {

    @Autowired
    private TravelService travelService;

    @GetMapping("/my-upcoming")
    public ResponseEntity<List<UpcomingTravelDTO>> getMyUpcomingTravels(@RequestParam String id) {
        List<UpcomingTravelDTO> travels = travelService.getUpcomingTravelsForUser(id);
        return ResponseEntity.ok(travels);
    }

    @GetMapping("/my-upcoming-motorist")
    public ResponseEntity<List<UpcomingTravelDTO>> getMotoristUpcomingTravels(@RequestParam String id) {
        List<UpcomingTravelDTO> travels = travelService.getUpcomingTravelsForMotorist(id);
        return ResponseEntity.ok(travels);
    }

}