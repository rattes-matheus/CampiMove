package com.campimove.backend.controller;

import com.campimove.backend.dto.MotoristaDTO;
import com.campimove.backend.entity.Motorista;
import com.campimove.backend.service.MotoristaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/motorista")
public class MotoristaController {

    @Autowired
    private MotoristaService motoristaService;

    @PostMapping("/cadastrar")
    public Motorista cadastrar(@RequestBody MotoristaDTO dto) {
        return motoristaService.cadastrarMotorista(dto);
    }

    @GetMapping("/listar")
    public List<Motorista> listar() {
        return motoristaService.listarTodos();
    }

    @GetMapping("/{id}")
    public Motorista buscar(@PathVariable Long id) {
        return motoristaService.buscarPorId(id);
    }

    @DeleteMapping("/deletar/{id}")
    public void deletar(@PathVariable Long id) {
        motoristaService.deletar(id);
    }
}
