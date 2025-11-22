package com.campimove.backend.dtos;

public record UserReportResponseDTO(
        Long id,
        Long userid,
        String driverName,
        String report_text
) {}