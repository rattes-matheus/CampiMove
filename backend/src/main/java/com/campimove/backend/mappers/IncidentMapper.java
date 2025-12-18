package com.campimove.backend.mappers;

import com.campimove.backend.dtos.IncidentResponse;
import com.campimove.backend.dtos.IncidentRequest;
import com.campimove.backend.entities.Incident; 
import com.campimove.backend.entities.ResolutionNote; 
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface IncidentMapper { 

    IncidentMapper INSTANCE = Mappers.getMapper(IncidentMapper.class); 

    Incident toEntity(IncidentRequest request);

    @Mapping(source = "resolutionNotes", target = "resolutionNotes")
    IncidentResponse toResponse(Incident incident); 
    
    IncidentResponse.ResolutionNoteResponse toNoteResponse(ResolutionNote note);
}