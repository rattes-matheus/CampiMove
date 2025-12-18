package com.campimove.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "resolution_notes")
public class ResolutionNote {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String note;
    
    private String adminName; 
    
    
    private LocalDateTime createdAt = LocalDateTime.now(); 

    @ManyToOne(fetch = FetchType.LAZY)
    
    @JoinColumn(name = "incident_id") 
    private Incident incident; 

    /*
    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }
    */
}