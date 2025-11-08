package com.campimove.backend.service;

import com.campimove.backend.dto.MotoristaDTO;
import com.campimove.backend.entity.Motorista;
import com.campimove.backend.repository.MotoristaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MotoristaService {

    @Autowired
    private MotoristaRepository motoristaRepository;

    public Motorista cadastrarMotorista(MotoristaDTO dto) {
        Motorista motorista = new Motorista(dto.getNome(), dto.getCpf(), dto.getCnh(), dto.getTelefone());
        return motoristaRepository.save(motorista);
    }

    public List<Motorista> listarTodos() {
        return motoristaRepository.findAll();
    }

    public Motorista buscarPorId(Long id) {
        return motoristaRepository.findById(id).orElse(null);
    }

    public void deletar(Long id) {
        motoristaRepository.deleteById(id);
    }
}
