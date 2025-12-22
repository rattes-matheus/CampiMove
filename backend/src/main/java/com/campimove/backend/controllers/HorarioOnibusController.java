package com.campimove.backend.controllers;

import com.campimove.backend.dtos.CriarHorarioRequest;
import com.campimove.backend.dtos.HorarioOnibusResponse;
import com.campimove.backend.dtos.InfoRotaResponse;
import com.campimove.backend.entities.HorarioOnibus;
import com.campimove.backend.services.HorarioOnibusConsultaService;
import com.campimove.backend.services.HorarioOnibusGestaoService;
import com.campimove.backend.services.HorarioOnibusMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/horarios-onibus")
public class HorarioOnibusController {
    
    private final HorarioOnibusConsultaService consultaService;
    private final HorarioOnibusGestaoService gestaoService;
    private final HorarioOnibusMapper mapper;
    
    @Autowired
    public HorarioOnibusController(HorarioOnibusConsultaService consultaService,
                                  HorarioOnibusGestaoService gestaoService,
                                  HorarioOnibusMapper mapper) {
        this.consultaService = consultaService;
        this.gestaoService = gestaoService;
        this.mapper = mapper;
    }
    
    @GetMapping("/{origem}")
    public ResponseEntity<List<String>> getHorariosPorOrigem(@PathVariable String origem) {
        try {
            List<String> horarios = consultaService.getHorariosFormatadosPorOrigem(origem);
            return ResponseEntity.ok(horarios);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/rota/{origem}")
    public ResponseEntity<InfoRotaResponse> getInfoRota(@PathVariable String origem) {
        try {
            List<String> horarios = consultaService.getHorariosFormatadosPorOrigem(origem);
            String destino = origem.equals("C1") ? "C2" : "C1";
            
            Map<String, Object> rotaInfo = new HashMap<>();
            if (origem.equals("C1")) {
                rotaInfo.put("baseTime", 9);
                rotaInfo.put("distance", 4);
                rotaInfo.put("peakIncrease", 8);
            } else {
                rotaInfo.put("baseTime", 6);
                rotaInfo.put("distance", 3);
                rotaInfo.put("peakIncrease", 6);
            }
            
            InfoRotaResponse response = new InfoRotaResponse(horarios, origem, destino, rotaInfo);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<HorarioOnibusResponse> createHorario(@RequestBody CriarHorarioRequest request) {
        try {
            HorarioOnibus novoHorario = gestaoService.criarHorario(request.getOrigem(), request.getHorario());
            HorarioOnibusResponse response = mapper.toResponse(novoHorario);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<HorarioOnibusResponse>> getAllHorarios() {
        try {
            List<HorarioOnibusResponse> horarios = consultaService.findAllHorariosAtivos()
                    .stream()
                    .map(mapper::toResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(horarios);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativarHorario(@PathVariable Long id) {
        try {
            gestaoService.desativarHorario(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}