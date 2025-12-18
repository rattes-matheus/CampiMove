
    package com.campimove.backend.services;

    import com.campimove.backend.dtos.NoticeResponseDTO;
    import com.campimove.backend.dtos.SendNoticeDTO;
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

        public void sendNotice (SendNoticeDTO formData){
            noticesRepository.save(new Notice(
                    formData.title(),
                    formData.message(),
                    formData.priority(),
                    true,
                    LocalDateTime.now()
            ));
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

    }
