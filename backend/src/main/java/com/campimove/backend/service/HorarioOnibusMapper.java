package com.campimove.backend.service;

import com.campimove.backend.dto.HorarioOnibusResponse;
import com.campimove.backend.entities.HorarioOnibus;
import org.springframework.stereotype.Component;

@Component
public class HorarioOnibusMapper {
    
    public HorarioOnibusResponse toResponse(HorarioOnibus horario) {
        return new HorarioOnibusResponse(
            horario.getId(),
            horario.getOrigem(),
            horario.getHorario(),
            horario.isAtivo()
        );
    }
}