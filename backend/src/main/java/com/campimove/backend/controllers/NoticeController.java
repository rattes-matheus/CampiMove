

package com.campimove.backend.controllers;

import com.campimove.backend.dtos.SendNoticeDTO;
import com.campimove.backend.services.NoticeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/notices")
public class NoticeController {
    @Autowired
    private NoticeService noticeService;

    @PostMapping("/send")
    public ResponseEntity<String> sendNotice(@Valid @RequestBody SendNoticeDTO formData) {
        noticeService.sendNotice(formData);

        return ResponseEntity.status(200).body("Notice has been sent successfully!");
    }

    @GetMapping("/get")
    public ResponseEntity<?> getNotices() {
        return ResponseEntity.ok(noticeService.getNotices());
    }
}