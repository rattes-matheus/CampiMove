package com.campimove.backend.service;

import com.campimove.backend.dto.CadastraHorarioDeOnibusDTO;
import com.campimove.backend.entity.CadastraHorarioDeOnibus;
import com.campimove.backend.entity.Motorista;
import com.campimove.backend.entity.Onibus;
import com.campimove.backend.repository.CadastraHorarioDeOnibusRepository;
import com.campimove.backend.repository.MotoristaRepository;
import com.campimove.backend.repository.OnibusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CadastraHorarioDeOnibusService {

    @Autowired
    private CadastraHorarioDeOnibusRepository horarioRepository;

    @Autowired
    private MotoristaRepository motoristaRepository;

    @Autowired
    private OnibusRepository onibusRepository;

    public CadastraHorarioDeOnibus cadastrarHorario(CadastraHorarioDeOnibusDTO dto) {
        Onibus onibus = onibusRepository.findById(dto.getOnibusId())
                .orElseThrow(() -> new RuntimeException("Ônibus não encontrado"));

        Motorista motorista = motoristaRepository.findById(dto.getMotoristaId())
                .orElseThrow(() -> new RuntimeException("Motorista não encontrado"));

        CadastraHorarioDeOnibus horario = new CadastraHorarioDeOnibus(
                onibus,
                motorista,
                dto.getOrigem(),
                dto.getDestino(),
                dto.getHorarioSaida(),
                dto.getHorarioChegada()
        );

        return horarioRepository.save(horario);
    }

    public List<CadastraHorarioDeOnibus> listarTodos() {
        return horarioRepository.findAll();
    }

    public CadastraHorarioDeOnibus buscarPorId(Long id) {
        return horarioRepository.findById(id).orElse(null);
    }

    public void deletar(Long id) {
        horarioRepository.deleteById(id);
    }
}
