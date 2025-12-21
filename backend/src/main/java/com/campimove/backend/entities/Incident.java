package com.campimove.backend.entities;

import com.campimove.backend.enums.IncidentCategory;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "incidents")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    private String full_description;

    @Enumerated(EnumType.STRING)
    private IncidentCategory category;

    @NotNull
    private Long reporter_id;

    @NotNull
    private LocalDateTime created_at;

    public Incident(String title, String full_description, IncidentCategory category, Long reporter_id) {
        this.title = title;
        this.full_description = full_description;
        this.category = category;
        this.reporter_id = reporter_id;
        this.created_at = LocalDateTime.now();
    }
}