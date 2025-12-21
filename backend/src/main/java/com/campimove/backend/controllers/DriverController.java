package com.campimove.backend.controllers;

import com.campimove.backend.dtos.DriverRequestDTO;
import com.campimove.backend.dtos.DriverResponseDTO;
import com.campimove.backend.dtos.DriverDropdownDTO;
import com.campimove.backend.services.DriverService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @PostMapping
    public ResponseEntity<DriverResponseDTO> createDriver(@Valid @RequestBody DriverRequestDTO dto) {
        DriverResponseDTO driver = driverService.createDriver(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(driver);
    }

    @GetMapping
    public ResponseEntity<List<DriverResponseDTO>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    @GetMapping("/dropdown")
    public ResponseEntity<List<DriverDropdownDTO>> getActiveDriversForDropdown() {
        return ResponseEntity.ok(driverService.getActiveDriversForDropdown());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DriverResponseDTO> getDriverById(@PathVariable Long id) {
        return ResponseEntity.ok(driverService.getDriverById(id));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<Void> toggleDriverStatus(@PathVariable Long id) {
        driverService.toggleDriverStatus(id);
        return ResponseEntity.ok().build();
    }
}