package com.campimove.backend.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId; 
    private String type;
    private String description;
    private String route;
    private LocalDateTime createdAt;

    public Report() {
        this.createdAt = LocalDateTime.now();
    }

    public Report(String userId, String type, String description, String route) {
        this.userId = userId;
        this.type = type;
        this.description = description;
        this.route = route;
        this.createdAt = LocalDateTime.now();
    }


    public Long getId() { return id; }
    public String getUserId() { return userId; }
    public String getType() { return type; }
    public String getDescription() { return description; }
    public String getRoute() { return route; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setUserId(String userId) { this.userId = userId; }
    public void setType(String type) { this.type = type; }
    public void setDescription(String description) { this.description = description; }
    public void setRoute(String route) { this.route = route; }
}
