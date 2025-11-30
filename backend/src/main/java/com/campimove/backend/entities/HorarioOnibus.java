package com.campimove.backend.entities;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "horarios_onibus")
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
    
   
    public HorarioOnibus() {}
    
    public HorarioOnibus(String origem, LocalTime horario) {
        this.origem = origem;
        this.horario = horario;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getOrigem() { return origem; }
    public void setOrigem(String origem) { this.origem = origem; }
    
    public LocalTime getHorario() { return horario; }
    public void setHorario(LocalTime horario) { this.horario = horario; }
    
    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }
}