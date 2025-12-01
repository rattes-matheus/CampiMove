package com.campimove.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalTime;

public record IntercampiRouteFormDTO(
        Long id,
        String route,
        @JsonFormat(pattern = "HH:mm")
        LocalTime schedule
) {}