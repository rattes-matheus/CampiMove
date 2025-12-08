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

    public void sendNotification(String title, String message, Integer programmedTime, String timeUnit) {
        if (programmedTime == null || programmedTime <= 0)
            programmedTime = 1;

        if (timeUnit == null)
            timeUnit = "MINUTES";

        int minutes;

        switch (timeUnit.toUpperCase()){
            case "HOURS" -> minutes =programmedTime * 60;
            case "DAYS" -> minutes = programmedTime * 60 * 24;
            default -> minutes = programmedTime;
        }

        repository.save(new AdminNotification(title, message, minutes));
    }

    public List<AdminNotification> getNotifications() {
        LocalDateTime now = LocalDateTime.now();
        return repository.findAll()
                .stream()
                .filter(n -> n.getDefinedTime().isAfter(now))
                .toList();
    }
}
