package com.campimove.backend.controller;

import com.campimove.backend.dto.ReportRequest;
import com.campimove.backend.dto.ReportResponse;
import com.campimove.backend.entities.Report;
import com.campimove.backend.service.ReportConsultaService;
import com.campimove.backend.service.ReportGestaoService;
import com.campimove.backend.service.ReportMapper;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    private final ReportGestaoService gestaoService;
    private final ReportConsultaService consultaService;
    private final ReportMapper mapper;

    public ReportController(ReportGestaoService gestaoService, ReportConsultaService consultaService, ReportMapper mapper) {
        this.gestaoService = gestaoService;
        this.consultaService = consultaService;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<ReportResponse> criar(@RequestBody ReportRequest request) {
        Report report = gestaoService.criar(request);
        return ResponseEntity.ok(mapper.toResponse(report));
    }

    @GetMapping
    public ResponseEntity<List<ReportResponse>> listar() {
        List<ReportResponse> lista = consultaService.listarTodos()
                .stream()
                .map(mapper::toResponse)
                .toList();

        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportResponse> buscarPorId(@PathVariable Long id) {
        return consultaService.buscarPorId(id)
                .map(mapper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReportResponse> atualizar(@PathVariable Long id, @RequestBody ReportRequest request) {
        Report atualizado = gestaoService.atualizar(id, request);
        return ResponseEntity.ok(mapper.toResponse(atualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        gestaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
