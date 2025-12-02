package com.campimove.backend.services;

import com.campimove.backend.dtos.ReportResponse;
import com.campimove.backend.entities.Report;
import org.springframework.stereotype.Component;

@Component
public class ReportMapper {

    public ReportResponse toResponse(Report report) {
        return new ReportResponse(
                report.getId(),
                report.getUserid(),
                report.getType(),
                report.getDescription(),
                report.getRoute(),
                report.getCreatedAt()
        );
    }
}
