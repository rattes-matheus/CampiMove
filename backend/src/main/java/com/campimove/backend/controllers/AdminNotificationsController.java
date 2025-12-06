package com.campimove.backend.controllers;

import com.campimove.backend.dtos.AdminNotificationsDTO;
import com.campimove.backend.entities.AdminNotification;
import com.campimove.backend.repositories.AdminNotificationsRepository;
import com.campimove.backend.services.AdminNotificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class AdminNotificationsController {
    @Autowired
    private AdminNotificationsRepository repository;

    @Autowired
    private AdminNotificationService service;

    @PostMapping
    public ResponseEntity<String> sendNotification(@Valid @RequestBody AdminNotificationsDTO formData) {
        service.sendNotification(formData.title(), formData.message());
        return ResponseEntity.status(201).body("Notification send successfuly!");
    }

    @GetMapping
    public ResponseEntity<List<AdminNotification>> getNotifications() {
        return ResponseEntity.status(200).body(service.getNotifications());
    }
}
