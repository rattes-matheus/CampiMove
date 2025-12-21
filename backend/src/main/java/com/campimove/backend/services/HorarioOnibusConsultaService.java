package com.campimove.backend.services;

import com.campimove.backend.entities.HorarioOnibus;
import com.campimove.backend.repositories.HorarioOnibusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class HorarioOnibusConsultaService {
    
    @Autowired
    private HorarioOnibusRepository horarioOnibusRepository;
    
    public List<HorarioOnibus> findHorariosAtivosPorOrigem(String origem) {
        return horarioOnibusRepository.findByOrigemAndAtivoTrueOrderByHorario(origem);
    }
    
    public List<String> getHorariosFormatadosPorOrigem(String origem) {
        List<HorarioOnibus> horarios = findHorariosAtivosPorOrigem(origem);
        return horarios.stream()
                .map(horario -> horario.getHorario().toString())
                .toList();
    }
    
    public List<HorarioOnibus> findAllHorariosAtivos() {
        return horarioOnibusRepository.findByAtivoTrueOrderByOrigemAscHorarioAsc();
    }
    
    public Optional<HorarioOnibus> findProximoHorario(String origem, LocalTime horarioAtual) {
        List<HorarioOnibus> proximos = horarioOnibusRepository.findProximosHorarios(origem, horarioAtual);
        return proximos.stream().findFirst();
    }
}