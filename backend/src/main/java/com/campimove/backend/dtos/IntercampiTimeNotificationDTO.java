package com.campimove.backend.dtos;

import java.time.LocalTime;

public record IntercampiTimeNotificationDTO (
        String route,
        LocalTime schedule,
        long minutesLeft,
        String formattedTime
) {}