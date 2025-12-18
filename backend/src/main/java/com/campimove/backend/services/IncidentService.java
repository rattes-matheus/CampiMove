package com.campimove.backend.services; 

import com.campimove.backend.repositories.IncidentRepository; 
import com.campimove.backend.repositories.IncidentSpecification; 
import com.campimove.backend.mappers.IncidentMapper; 
import com.campimove.backend.entities.Incident;
import com.campimove.backend.entities.ResolutionNote; 
import com.campimove.backend.dtos.IncidentResponse; 
import com.campimove.backend.dtos.IncidentRequest; 
import com.campimove.backend.dtos.IncidentNoteRequest; 
import com.campimove.backend.enums.IncidentStatus; 

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service 
public class IncidentService { 


    private final IncidentRepository incidentRepository; 
    private final IncidentMapper incidentMapper; 
    
    public IncidentService(IncidentRepository incidentRepository, IncidentMapper incidentMapper) {
        this.incidentRepository = incidentRepository;
        this.incidentMapper = incidentMapper;
    }
    /*
    public IncidentMapper getIncidentMapper() {
        return incidentMapper;
    }
    */

    public Page<Incident> findReports(String searchTerm, String status, String category, Pageable pageable) {
        return incidentRepository.findAll(
            IncidentSpecification.filterBy(searchTerm, status, category), 
            pageable
        );
    }

    @Transactional

    public IncidentResponse createReport(IncidentRequest request) {
        Incident newIncident = incidentMapper.toEntity(request); 
        
        newIncident.setReportedBy("Admin Campimove"); 
        newIncident.setReporterId(1L); 
        
        Incident savedIncident = incidentRepository.save(newIncident); 
        return incidentMapper.toResponse(savedIncident);
    }

    public IncidentResponse getReportDetails(Long id) {
        Incident incident = incidentRepository.findById(id) 
            .orElseThrow(() -> new IncidentNotFoundException("Report de Incidente não encontrado com ID: " + id)); 
        
        return incidentMapper.toResponse(incident);
    }
    
    @Transactional
    public IncidentResponse updateReport(Long id, IncidentRequest request) {
        Incident existingIncident = incidentRepository.findById(id)
            .orElseThrow(() -> new IncidentNotFoundException("Report de Incidente não encontrado com ID: " + id)); 

        if (request.getStatus() != null) {
            existingIncident.setStatus(request.getStatus());
        }

        Incident updatedIncident = incidentRepository.save(existingIncident); 
        return incidentMapper.toResponse(updatedIncident);
    }

    @Transactional
    public IncidentResponse addResolutionNote(Long incidentId, IncidentNoteRequest noteRequest, String adminName) {
        Incident incident = incidentRepository.findById(incidentId) 
            .orElseThrow(() -> new IncidentNotFoundException("Report de Incidente não encontrado com ID: " + incidentId)); 
        
        ResolutionNote note = new ResolutionNote();
        note.setNote(noteRequest.getNote());
        note.setAdminName(adminName); 
        note.setIncident(incident); 
        
        incident.getResolutionNotes().add(note);
        
        Incident savedIncident = incidentRepository.save(incident); 
        return incidentMapper.toResponse(savedIncident);
    }
    
    @Transactional
    public void closeReport(Long id) {
        Incident incident = incidentRepository.findById(id) 
            .orElseThrow(() -> new IncidentNotFoundException("Report de Incidente não encontrado com ID: " + id)); 
        
        if (incident.getStatus() != IncidentStatus.RESOLVIDO) { 
            throw new IllegalStateException("Ação Proibida: Apenas Reports RESOLVIDOS podem ser FECHADOS.");
        }
        incident.setStatus(IncidentStatus.FECHADO); 
        incidentRepository.save(incident);
    }
}