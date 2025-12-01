package com.campimove.backend.controllers;

import com.campimove.backend.entities.Driver;
import com.campimove.backend.entities.User;
import com.campimove.backend.services.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/drivers")
public class DriverController {

    @Autowired
    private DriverService generateDriverService;

    @GetMapping
    public ResponseEntity<List<Driver>> getDrivers() {
        return ResponseEntity.status(200).body(generateDriverService.generate());
    }

}
