package com.campimove.backend.controllers;

import com.campimove.backend.dtos.BusDTO;
import com.campimove.backend.dtos.CreateBusDTO;
import com.campimove.backend.dtos.UpdateBusDTO;
import com.campimove.backend.services.BusService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
public class BusController {

    @Autowired
    private BusService busService;

    @GetMapping
    public ResponseEntity<List<BusDTO>> getAllBuses() {
        return ResponseEntity.ok(busService.getAllBuses());
    }

    @GetMapping("/active")
    public ResponseEntity<List<BusDTO>> getActiveBuses() {
        return ResponseEntity.ok(busService.getActiveBuses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusDTO> getBusById(@PathVariable Long id) {
        return ResponseEntity.ok(busService.getBusById(id));
    }

    @PostMapping
    public ResponseEntity<BusDTO> createBus(@Valid @RequestBody CreateBusDTO dto) {
        return ResponseEntity.ok(busService.createBus(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BusDTO> updateBus(@PathVariable Long id, @Valid @RequestBody UpdateBusDTO dto) {
        return ResponseEntity.ok(busService.updateBus(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBus(@PathVariable Long id) {
        busService.deleteBus(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<BusDTO> toggleBusStatus(@PathVariable Long id) {
        return ResponseEntity.ok(busService.toggleBusStatus(id));
    }
}