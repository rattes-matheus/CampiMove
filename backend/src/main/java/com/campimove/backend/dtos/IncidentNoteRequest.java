package com.campimove.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data; 

@Data
public class IncidentNoteRequest {

    @NotBlank(message = "O conteúdo da nota é obrigatório.")
    private String note;
}