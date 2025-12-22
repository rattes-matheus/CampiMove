package com.campimove.backend.services;

import com.campimove.backend.dtos.IntercampiTimeNotificationDTO;
import com.campimove.backend.entities.HorarioOnibus;
import com.campimove.backend.repositories.HorarioOnibusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;


@Service
public class IntercampiTimeNotificationService {

    @Autowired
    private HorarioOnibusRepository repository;

    public IntercampiTimeNotificationDTO getNextIntercampi() {

        List<HorarioOnibus> routes = repository.findAll();
        if (routes.isEmpty()) return null;

        routes.sort(Comparator.comparing(HorarioOnibus::getHorario));

        LocalDate today = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();

        for (HorarioOnibus route : routes) {
            LocalDateTime scheduleToday = LocalDateTime.of(today, route.getHorario());

            if (!scheduleToday.isBefore(now)) {
                long diff = Duration.between(now, scheduleToday).toMinutes();
                return new IntercampiTimeNotificationDTO(
                        route.getOrigem(),
                        route.getHorario(),
                        diff,
                        format(diff)
                );
            }
        }

        HorarioOnibus first = routes.getFirst();
        LocalDateTime scheduleTomorrow = LocalDateTime.of(today.plusDays(1), first.getHorario());

        long diffNextDay = Duration.between(now, scheduleTomorrow).toMinutes();

        return new IntercampiTimeNotificationDTO(
                first.getOrigem(),
                first.getHorario(),
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