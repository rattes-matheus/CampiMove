package com.campimove.backend.controllers;

import com.campimove.backend.dtos.UserReportDTO;
import com.campimove.backend.entities.UserReport;
import com.campimove.backend.repositories.UserReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/send-report")
public class SendReportController {
    @Autowired
    private UserReportRepository userReportRepository;

    @PostMapping
    public ResponseEntity<String> registerReport(@RequestBody UserReportDTO formData){
        userReportRepository.save(new UserReport(formData.userid(), formData.reporter_id(), formData.report_text()));
        return ResponseEntity.status(201).body("Reported successfuly!");
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkReport(@RequestParam Long reporterId, @RequestParam Long userid) {
        boolean check = userReportRepository.existsByReporterIdAndUserid(reporterId, userid);
        return ResponseEntity.status(200).body(check);
    }
}