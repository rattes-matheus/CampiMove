package com.campimove.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Onibus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String placa;
    private String modelo;
    private int capacidade;

    public Onibus() {
    }

    public Onibus(String placa, String modelo, int capacidade) {
        this.placa = placa;
        this.modelo = modelo;
        this.capacidade = capacidade;
    }
}
