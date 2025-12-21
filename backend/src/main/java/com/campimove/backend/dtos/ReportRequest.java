package com.campimove.backend.dtos;

public class ReportRequest {

    private String userId;
    private String type;
    private String description;
    private String route;

    public String getUserId() { return userId; }
    public String getType() { return type; }
    public String getDescription() { return description; }
    public String getRoute() { return route; }

    public void setUserId(String userId) { this.userId = userId; }
    public void setType(String type) { this.type = type; }
    public void setDescription(String description) { this.description = description; }
    public void setRoute(String route) { this.route = route; }
}
