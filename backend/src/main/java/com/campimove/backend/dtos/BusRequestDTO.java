package com.campimove.backend.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BusRequestDTO {
    private String plate;
    private String company;
    private String model;
    private Integer capacity;
    private Integer year;
    private Long driverId; // ID do motorista (pode ser null)
}