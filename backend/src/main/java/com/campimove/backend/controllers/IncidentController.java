package com.campimove.backend.controllers; 

import com.campimove.backend.dtos.IncidentRequest; 
import com.campimove.backend.dtos.IncidentResponse;
import com.campimove.backend.dtos.IncidentNoteRequest;
import com.campimove.backend.services.IncidentService;
import com.campimove.backend.mappers.IncidentMapper; // NOVO: Importe o Mapper
import com.campimove.backend.entities.Incident; // NOVO: Importe a Entidade para o map

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired; // NOVO: Boa prática para injeção

@RestController
@RequestMapping("/api/reports") 
public class IncidentController {

    private final IncidentService incidentService;
    private final IncidentMapper incidentMapper; 

    @Autowired 
    public IncidentController(IncidentService incidentService, IncidentMapper incidentMapper) { 
        this.incidentService = incidentService;
        this.incidentMapper = incidentMapper; 
    }

    @GetMapping("/search") 
    public ResponseEntity<Page<IncidentResponse>> getFilteredReports( 
        @RequestParam(required = false) String searchTerm,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String category,
        Pageable pageable) { 

        
        Page<IncidentResponse> reportsPage = incidentService.findReports(searchTerm, status, category, pageable) 
            .map(incidentMapper::toResponse); 
        
        return ResponseEntity.ok(reportsPage);
    } 

    @PostMapping
    public ResponseEntity<IncidentResponse> createReport(@Valid @RequestBody IncidentRequest request) { 
        IncidentResponse response = incidentService.createReport(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponse> getReportDetails(@PathVariable Long id) { 
        IncidentResponse response = incidentService.getReportDetails(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncidentResponse> updateReport(@PathVariable Long id, @Valid @RequestBody IncidentRequest request) {
        IncidentResponse response = incidentService.updateReport(id, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/notes")
    public ResponseEntity<IncidentResponse> addResolutionNote( 
        @PathVariable Long id, 
        @Valid @RequestBody IncidentNoteRequest noteRequest,
        @RequestHeader(value = "X-Admin-Name", defaultValue = "Sistema") String adminName
    ) {
        IncidentResponse response = incidentService.addResolutionNote(id, noteRequest, adminName);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/close")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void closeReport(@PathVariable Long id) {
        incidentService.closeReport(id);
    }
}