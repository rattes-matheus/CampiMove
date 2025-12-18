package com.campimove.backend.entities;

import com.campimove.backend.enums.IncidentCategory; 
import com.campimove.backend.enums.IncidentStatus; 
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "incidents") 
@Data
public class Incident { 

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Lob 
    private String fullDescription;

    @Enumerated(EnumType.STRING)
    private IncidentCategory category; 

    @Enumerated(EnumType.STRING)
    private IncidentStatus status = IncidentStatus.ABERTO; 

    private String reportedBy;

    private Long reporterId;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "incident", cascade = CascadeType.ALL, orphanRemoval = true) 
    private List<ResolutionNote> resolutionNotes = new ArrayList<>();
}