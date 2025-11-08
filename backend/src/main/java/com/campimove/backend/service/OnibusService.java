package com.campimove.backend.service;

import com.campimove.backend.dto.OnibusDTO;
import com.campimove.backend.entity.Onibus;
import com.campimove.backend.repository.OnibusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OnibusService {

    @Autowired
    private OnibusRepository onibusRepository;

    public Onibus cadastrarOnibus(OnibusDTO dto) {
        Onibus onibus = new Onibus(dto.getPlaca(), dto.getModelo(), dto.getCapacidade());
        return onibusRepository.save(onibus);
    }

    public List<Onibus> listarTodos() {
        return onibusRepository.findAll();
    }

    public Onibus buscarPorId(Long id) {
        return onibusRepository.findById(id).orElse(null);
    }

    public void deletar(Long id) {
        onibusRepository.deleteById(id);
    }
}
