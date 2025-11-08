package com.campimove.backend.controller;

import com.campimove.backend.dto.AdministradorDTO;
import com.campimove.backend.entity.Administrador;
import com.campimove.backend.service.AdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/administradores")
public class AdministradorController {

    @Autowired
    private AdministradorService administradorService;

    @PostMapping("/cadastrar")
    public Administrador cadastrarAdministrador(@RequestBody AdministradorDTO dto) {
        return administradorService.salvarAdministrador(dto);
    }

    @GetMapping("/listar")
    public List<Administrador> listarAdministradores() {
        return administradorService.listarAdministradores();
    }

    @GetMapping("/verificar-email/{email}")
    public boolean verificarEmail(@PathVariable String email) {
        return administradorService.verificarEmailExistente(email);
    }
}
