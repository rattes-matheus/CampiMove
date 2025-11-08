package com.campimove.backend.service;

import com.campimove.backend.dto.AdministradorDTO;
import com.campimove.backend.entity.Administrador;
import com.campimove.backend.repository.AdministradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdministradorService {

    @Autowired
    private AdministradorRepository administradorRepository;

    public Administrador salvarAdministrador(AdministradorDTO dto) {
        Administrador adm = new Administrador(dto.getNome(), dto.getEmail(), dto.getSenha());
        return administradorRepository.save(adm);
    }

    public List<Administrador> listarAdministradores() {
        return administradorRepository.findAll();
    }

    public boolean verificarEmailExistente(String email) {
        return administradorRepository.existsByEmail(email);
    }
}
