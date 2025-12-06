package com.campimove.backend.services;

import com.campimove.backend.entities.AdminNotification;
import com.campimove.backend.repositories.AdminNotificationsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminNotificationService {
    @Autowired
    private AdminNotificationsRepository repository;

    public void sendNotification(String title, String message) {
        repository.save(new AdminNotification(title, message, LocalDateTime.now()));
    }

    public List<AdminNotification> getNotifications() {
        return repository.findAll();
    }
}
