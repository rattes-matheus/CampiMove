package com.campimove.backend.dtos;

import com.campimove.backend.enums.IncidentCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


public record IncidentRequestDTO (

    @NotBlank
    String title,

    @NotBlank
    String full_description,

    @NotNull
    IncidentCategory category,

    @NotNull
    Long reporter_id
){}