package com.campimove.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class CadastraHorarioDeOnibus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relacionamento com o ônibus
    @ManyToOne
    @JoinColumn(name = "onibus_id", nullable = false)
    private Onibus onibus;

    // Relacionamento com o motorista
    @ManyToOne
    @JoinColumn(name = "motorista_id", nullable = false)
    private Motorista motorista;

    private String origem;
    private String destino;

    private LocalDateTime horarioSaida;
    private LocalDateTime horarioChegada;

    public CadastraHorarioDeOnibus() {}

    public CadastraHorarioDeOnibus(Onibus onibus, Motorista motorista, String origem, String destino,
                                   LocalDateTime horarioSaida, LocalDateTime horarioChegada) {
        this.onibus = onibus;
        this.motorista = motorista;
        this.origem = origem;
        this.destino = destino;
        this.horarioSaida = horarioSaida;
        this.horarioChegada = horarioChegada;
    }
}
