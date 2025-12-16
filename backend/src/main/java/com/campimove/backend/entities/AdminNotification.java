package com.campimove.backend.entities;

import com.campimove.backend.enums.NotificationTarget;
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

    @NotBlank
    private String message;

    @NotNull
    private LocalDateTime createdAt;

    @NotNull
    private Integer programmedTime;

    @NotNull
    private LocalDateTime definedTime;

    @Enumerated(EnumType.STRING)
    @NotNull
    private NotificationTarget target;


    public AdminNotification(String title, String message, Integer programmedTime, NotificationTarget target) {
        this.title = title;
        this.message = message;
        this.createdAt = LocalDateTime.now();
        this.programmedTime = programmedTime;
        this.definedTime = this.createdAt.plusMinutes(programmedTime);
        this.target = target;
    }
}
