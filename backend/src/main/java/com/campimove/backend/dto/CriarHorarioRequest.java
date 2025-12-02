package com.campimove.backend.dto;

import java.time.LocalTime;

public class CriarHorarioRequest {
    private String origem;
    private LocalTime horario;

    public CriarHorarioRequest() {}
    

    public CriarHorarioRequest(String origem, LocalTime horario) {
        this.origem = origem;
        this.horario = horario;
    }
    
    public String getOrigem() { return origem; }
    public void setOrigem(String origem) { this.origem = origem; }
    
    public LocalTime getHorario() { return horario; }
    public void setHorario(LocalTime horario) { this.horario = horario; }
}