package com.campimove.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter
@Setter
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userid;
    private String type;
    private String description;
    private String route;
    private LocalDateTime createdAt;

    public Report() {
        this.createdAt = LocalDateTime.now();
    }

    public Report(String userid, String type, String description, String route) {
        this.userid = userid;
        this.type = type;
        this.description = description;
        this.route = route;
        this.createdAt = LocalDateTime.now();
    }
}
