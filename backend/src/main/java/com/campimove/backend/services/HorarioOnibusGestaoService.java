package com.campimove.backend.services;

import com.campimove.backend.entities.HorarioOnibus;
import com.campimove.backend.repositories.HorarioOnibusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;

@Service
public class HorarioOnibusGestaoService {
    
    @Autowired
    private HorarioOnibusRepository horarioOnibusRepository;
    
    public HorarioOnibus criarHorario(String origem, LocalTime horario) {
        validarOrigem(origem);
        validarHorario(horario);
        
        HorarioOnibus novoHorario = new HorarioOnibus(origem, horario);
        return horarioOnibusRepository.save(novoHorario);
    }
    
    public HorarioOnibus desativarHorario(Long id) {
        HorarioOnibus horario = horarioOnibusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horário não encontrado"));
        
        horario.setAtivo(false);
        return horarioOnibusRepository.save(horario);
    }
    
    private void validarOrigem(String origem) {
        if (!origem.equals("C1") && !origem.equals("C2")) {
            throw new RuntimeException("Origem deve ser 'C1' ou 'C2'");
        }
    }
    
    private void validarHorario(LocalTime horario) {
        if (horario == null) {
            throw new RuntimeException("Horário não pode ser nulo");
        }
    }
}