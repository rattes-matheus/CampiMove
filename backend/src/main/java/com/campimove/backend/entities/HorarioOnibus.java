package com.campimove.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

@Entity
@Table(name = "horarios_onibus")
@Getter
@Setter
@NoArgsConstructor
public class HorarioOnibus {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "origem", nullable = false, length = 2)
    private String origem; 
    
    @Column(name = "horario", nullable = false)
    private LocalTime horario;
    
    @Column(name = "ativo", nullable = false)
    private boolean ativo = true;

    public HorarioOnibus(String origem, LocalTime horario) {
        this.origem = origem;
        this.horario = horario;
    }
}