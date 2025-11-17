package com.campimove.backend.dto;

import java.time.LocalTime;

public record IntercampiRouteFormDTO(
        Long id,
        String route,
        LocalTime schedule
) {}
