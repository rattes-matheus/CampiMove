package com.campimove.backend.dtos;

public record UserReportDTO (Long userid, Long reporter_id, String report_text) {
}
