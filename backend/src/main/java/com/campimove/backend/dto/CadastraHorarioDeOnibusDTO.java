package com.campimove.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class CadastraHorarioDeOnibusDTO {
    private Long onibusId;
    private Long motoristaId;
    private String origem;
    private String destino;
    private LocalDateTime horarioSaida;
    private LocalDateTime horarioChegada;
}
