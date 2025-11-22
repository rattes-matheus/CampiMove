package com.campimove.backend.controllers;

import com.campimove.backend.repositories.UserReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reports/actions")
public class DeleteReportController {
    @Autowired
    private UserReportRepository userReportRepository;

    @DeleteMapping("/{id}/ignore")
    public void ignoreReport(@PathVariable Long id) {
        userReportRepository.deleteById(id);
    }
}
