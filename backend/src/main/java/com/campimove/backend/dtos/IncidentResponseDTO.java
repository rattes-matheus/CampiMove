package com.campimove.backend.dtos;

import java.time.LocalDateTime;

public record IncidentResponseDTO(
        Long id,
        String title,
        String full_description,
        String formatted_summary,
        String category,
        Long reporter_id,
        String reporter_name,
        LocalDateTime created_at,
        String status
) {}