package com.campimove.backend.services;

import com.campimove.backend.dtos.NoticeResponseDTO;
import com.campimove.backend.dtos.SendNoticeDTO;
import com.campimove.backend.dtos.UpdateNoticeDTO;
import com.campimove.backend.entities.Notice;
import com.campimove.backend.repositories.NoticesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NoticeService {
    @Autowired
    private NoticesRepository noticesRepository;

    public Notice sendNotice(SendNoticeDTO formData){
        Notice notice = new Notice(
                formData.title(),
                formData.message(),
                formData.priority(),
                true,
                LocalDateTime.now()
        );

        return noticesRepository.save(notice);
    }

    public List<NoticeResponseDTO> getNotices() {
        return noticesRepository.findActiveOrdered()
                .stream()
                .map(n -> new NoticeResponseDTO(
                        n.getId(),
                        n.getTitle(),
                        n.getMessage(),
                        n.getPriority(),
                        n.isActive(),
                        n.getDate()
                ))
                .toList();
    }

    public void updateNotice(Long id, UpdateNoticeDTO data) {

        Notice notice = noticesRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Notice not found with id " + id)
                );

        notice.setTitle(data.title());
        notice.setMessage(data.message());
        notice.setPriority(data.priority());

        noticesRepository.save(notice);
    }

    public void deleteNotice(Long id){
        Notice notice = noticesRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Notice not found with id " + id)
                );

        notice.setActive(false);

        noticesRepository.save(notice);
    }
}