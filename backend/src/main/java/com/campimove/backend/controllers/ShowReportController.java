package com.campimove.backend.controllers;

import com.campimove.backend.entities.UserReport;
import com.campimove.backend.services.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
public class ShowReportController {
    @Autowired
    private ReportService reportService;

    @GetMapping
    public List<UserReport> getReports() {
        return reportService.listReports();
    }
}
