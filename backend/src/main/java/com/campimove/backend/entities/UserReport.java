package com.campimove.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "reports")
public class UserReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Long userid;

    @NotNull
    private Long reporterId;

    @NotBlank
    private String report_text;

    public UserReport(Long userId, Long reporterId, String text) {
        this.userid = userId;
        this.reporterId = reporterId;
        this.report_text = text;
    }
}