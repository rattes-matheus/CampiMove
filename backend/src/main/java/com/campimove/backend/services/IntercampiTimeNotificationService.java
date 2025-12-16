package com.campimove.backend.services;

import com.campimove.backend.dtos.IntercampiTimeNotificationDTO;
import com.campimove.backend.entities.IntercampiRoute;
import com.campimove.backend.repositories.IntercampiRouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;


@Service
public class IntercampiTimeNotificationService {

    @Autowired
    private IntercampiRouteRepository repository;

    public IntercampiTimeNotificationDTO getNextIntercampi() {

        List<IntercampiRoute> routes = repository.findAll();
        if (routes.isEmpty()) return null;

        routes.sort(Comparator.comparing(IntercampiRoute::getSchedule));

        LocalDate today = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();

        for (IntercampiRoute route : routes) {
            LocalDateTime scheduleToday = LocalDateTime.of(today, route.getSchedule());

            if (!scheduleToday.isBefore(now)) {
                long diff = Duration.between(now, scheduleToday).toMinutes();
                return new IntercampiTimeNotificationDTO(
                        route.getRoute(),
                        route.getSchedule(),
                        diff,
                        format(diff)
                );
            }
        }

        IntercampiRoute first = routes.get(0);
        LocalDateTime scheduleTomorrow = LocalDateTime.of(today.plusDays(1), first.getSchedule());

        long diffNextDay = Duration.between(now, scheduleTomorrow).toMinutes();

        return new IntercampiTimeNotificationDTO(
                first.getRoute(),
                first.getSchedule(),
                diffNextDay,
                format(diffNextDay)
        );
    }

    private String format(long totalMinutes) {
        long hours = totalMinutes / 60;
        long minutes = totalMinutes % 60;

        if (hours == 0) return minutes + " min";
        return hours + "h " + minutes + "min";
    }
}