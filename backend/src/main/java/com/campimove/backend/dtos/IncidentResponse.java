package com.campimove.backend.dtos;

import com.campimove.backend.enums.IncidentStatus; 
import com.campimove.backend.enums.IncidentCategory; 
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class IncidentResponse { 

    private Long id;
    private String title;
    private String fullDescription;
    private IncidentCategory category; 
    private IncidentStatus status; 
    private String reportedBy;
    private LocalDateTime createdAt;
    

    private List<ResolutionNoteResponse> resolutionNotes; 

    @Data
    public static class ResolutionNoteResponse {
        private Long id;
        private String note;
        private String adminName;
        private LocalDateTime createdAt;
    }
}