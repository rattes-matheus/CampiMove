package com.campimove.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "buses")
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true)
    private String plate;

    @NotBlank
    private String company;

    @NotNull
    @Min(1)
    private Integer capacity;

    @NotBlank
    private String model;

    @NotNull
    @Min(1990)
    private Integer year;

    @NotNull
    private Boolean active = true;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private User driver;

    public Bus(String plate, String company, Integer capacity, String model, Integer year) {
        this.plate = plate;
        this.company = company;
        this.capacity = capacity;
        this.model = model;
        this.year = year;
        this.active = true;
    }
}