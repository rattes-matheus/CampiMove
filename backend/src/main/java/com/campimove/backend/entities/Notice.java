package com.campimove.backend.entities;

import com.campimove.backend.enums.PriorityNotice;
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
@Table(name = "notices")
public class Notice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    private String message;

    @Enumerated(EnumType.STRING)
    private PriorityNotice priority;

    @NotNull
    private boolean active;

    private LocalDateTime date;

    public Notice (String title, String message, PriorityNotice priority, boolean active, LocalDateTime date) {
        this.title = title;
        this.message = message;
        this.priority = priority;
        this.active = active;
        this.date = date;
    }
}