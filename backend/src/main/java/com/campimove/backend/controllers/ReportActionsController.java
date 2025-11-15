package com.campimove.backend.controllers;

import com.campimove.backend.services.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reports")
public class ReportActionsController {
    @Autowired
    private ReportService reportService;

    @DeleteMapping("/{id}/ignore")
    public void ignoreReport(@PathVariable Long id) {
        reportService.ignoreReport(id);
    }

    @PostMapping("/{userId}/disable-user")
    public void disableUser(@PathVariable Long userId) {
        reportService.disableUser(userId, null);
    }

    @PostMapping("/{reportId}/{userId}/disable-from-report")
    public void disableFromReport(@PathVariable Long reportId, @PathVariable Long userId) {
        reportService.disableUser(userId, null);
    }
}
