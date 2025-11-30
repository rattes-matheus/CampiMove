package com.campimove.backend.dto;

import java.util.List;
import java.util.Map;

public class InfoRotaResponse {
    private List<String> horarios;
    private String origem;
    private String destino;
    private Map<String, Object> rotaInfo;
    
    public InfoRotaResponse() {}
    
    public InfoRotaResponse(List<String> horarios, String origem, String destino, Map<String, Object> rotaInfo) {
        this.horarios = horarios;
        this.origem = origem;
        this.destino = destino;
        this.rotaInfo = rotaInfo;
    }
    
    public List<String> getHorarios() { return horarios; }
    public void setHorarios(List<String> horarios) { this.horarios = horarios; }
    
    public String getOrigem() { return origem; }
    public void setOrigem(String origem) { this.origem = origem; }
    
    public String getDestino() { return destino; }
    public void setDestino(String destino) { this.destino = destino; }
    
    public Map<String, Object> getRotaInfo() { return rotaInfo; }
    public void setRotaInfo(Map<String, Object> rotaInfo) { this.rotaInfo = rotaInfo; }
}