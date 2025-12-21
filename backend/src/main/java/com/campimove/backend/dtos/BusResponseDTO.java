package com.campimove.backend.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BusResponseDTO {
    private Long id;
    private String plate;
    private String company;
    private String model;
    private Integer capacity;
    private Integer year;
    private DriverDropdownDTO driver;
    private boolean active;
}