package com.campimove.backend.controllers;

import com.campimove.backend.dtos.UserReportDTO;
import com.campimove.backend.entities.UserReport;
import com.campimove.backend.repositories.UserReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/send-report")
public class SendReportController {
    @Autowired
    private UserReportRepository userReportRepository;

    @PostMapping
    public ResponseEntity<String> registerReport(@RequestBody UserReportDTO formData){
        userReportRepository.save(new UserReport(formData.userid(), formData.report_text()));
        return ResponseEntity.status(201).body("Reported successfuly!");
    }
}