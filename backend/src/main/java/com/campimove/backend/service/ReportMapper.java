package com.campimove.backend.service;

import com.campimove.backend.dto.ReportResponse;
import com.campimove.backend.entities.Report;
import org.springframework.stereotype.Component;

@Component
public class ReportMapper {

    public ReportResponse toResponse(Report report) {
        return new ReportResponse(
                report.getId(),
                report.getUserId(),
                report.getType(),
                report.getDescription(),
                report.getRoute(),
                report.getCreatedAt()
        );
    }
}
