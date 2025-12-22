package com.campimove.backend.dtos;

import com.campimove.backend.enums.IncidentCategory; 
import com.campimove.backend.enums.IncidentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class IncidentRequest { 

    @NotBlank(message = "O título é obrigatório.")
    private String title;
    
    @NotBlank(message = "A descrição completa é obrigatória.")
    private String fullDescription;

    @NotNull(message = "A categoria é obrigatória.")
    private IncidentCategory category; 
    
    
    private IncidentStatus status; 
}