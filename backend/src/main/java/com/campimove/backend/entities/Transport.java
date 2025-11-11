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
@Table(name = "transports")
public class Transport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String type;

    @NotBlank
    private String model;

    @NotNull
    private Long capacity;

    @NotBlank
    private String contact;
    
    private boolean active;

    public Transport(String type, String model, String contact, Long capacity) {
        this.type = type;
        this.model = model;
        this.contact = contact;
        this.capacity = capacity;
        this.active = false;
    }
}
