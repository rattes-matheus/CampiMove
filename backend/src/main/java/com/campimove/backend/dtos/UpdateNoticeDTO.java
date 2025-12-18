package com.campimove.backend.dtos;

import com.campimove.backend.enums.PriorityNotice;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateNoticeDTO(

        @NotBlank
        String title,

        @NotBlank
        String message,

        @NotNull
        PriorityNotice priority

) {}