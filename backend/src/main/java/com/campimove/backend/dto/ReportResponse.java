package com.campimove.backend.dto;

import java.time.LocalDateTime;

public class ReportResponse {

    private Long id;
    private String userId;
    private String type;
    private String description;
    private String route;
    private LocalDateTime createdAt;

    public ReportResponse(Long id, String userId, String type, String description, String route, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.description = description;
        this.route = route;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getUserId() { return userId; }
    public String getType() { return type; }
    public String getDescription() { return description; }
    public String getRoute() { return route; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
