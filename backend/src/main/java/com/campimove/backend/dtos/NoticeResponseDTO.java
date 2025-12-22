package com.campimove.backend.dtos;

import com.campimove.backend.enums.PriorityNotice;

import java.time.LocalDateTime;

public record NoticeResponseDTO(

        Long id,
        String title,
        String message,
        PriorityNotice priority,
        boolean active,
        LocalDateTime date

) {}
