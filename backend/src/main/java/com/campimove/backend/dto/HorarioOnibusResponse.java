package com.campimove.backend.dto;

import java.time.LocalTime;

public class HorarioOnibusResponse {
    private Long id;
    private String origem;
    private LocalTime horario;
    private boolean ativo;
    
    public HorarioOnibusResponse() {}
    
    public HorarioOnibusResponse(Long id, String origem, LocalTime horario, boolean ativo) {
        this.id = id;
        this.origem = origem;
        this.horario = horario;
        this.ativo = ativo;
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