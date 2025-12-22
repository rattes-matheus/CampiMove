package com.campimove.backend.controllers;

import com.campimove.backend.dtos.NoticeResponseDTO;
import com.campimove.backend.dtos.SendNoticeDTO;
import com.campimove.backend.dtos.UpdateNoticeDTO;
import com.campimove.backend.entities.Notice;
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
    public ResponseEntity<NoticeResponseDTO> sendNotice(
            @Valid @RequestBody SendNoticeDTO formData
    ) {
        Notice notice = noticeService.sendNotice(formData);

        return ResponseEntity.ok(
                new NoticeResponseDTO(
                        notice.getId(),
                        notice.getTitle(),
                        notice.getMessage(),
                        notice.getPriority(),
                        notice.isActive(),
                        notice.getDate()
                )
        );
    }

    @GetMapping("/get")
    public ResponseEntity<?> getNotices() {
        return ResponseEntity.ok(noticeService.getNotices());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateNotice(
            @PathVariable Long id,
            @RequestBody UpdateNoticeDTO data
    ) {
        noticeService.updateNotice(id, data);
        return ResponseEntity.ok("Notice updated successfully!");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok("Notice deleted successfully!");
    }
}