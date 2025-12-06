package com.campimove.backend.entities;

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
@Table(name = "admin_notifications")
public class AdminNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotNull
    private String message;

    @NotNull
    private LocalDateTime createdAt;

    public AdminNotification(String title, String message, LocalDateTime createdAt) {
        this.title = title;
        this.message = message;
        this.createdAt = createdAt;
    }
}
