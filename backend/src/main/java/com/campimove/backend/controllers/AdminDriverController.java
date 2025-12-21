package com.campimove.backend.controllers;

import com.campimove.backend.dtos.DriverResponseDTO;
import com.campimove.backend.services.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/drivers")
public class AdminDriverController {

    @Autowired
    private DriverService driverService;

    @GetMapping
    public ResponseEntity<List<DriverResponseDTO>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }
}