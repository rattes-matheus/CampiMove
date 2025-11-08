package com.campimove.backend.controller;

import com.campimove.backend.dto.OnibusDTO;
import com.campimove.backend.entity.Onibus;
import com.campimove.backend.service.OnibusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/onibus")
public class OnibusController {

    @Autowired
    private OnibusService onibusService;

    @PostMapping("/cadastrar")
    public Onibus cadastrar(@RequestBody OnibusDTO dto) {
        return onibusService.cadastrarOnibus(dto);
    }

    @GetMapping("/listar")
    public List<Onibus> listar() {
        return onibusService.listarTodos();
    }

    @GetMapping("/{id}")
    public Onibus buscar(@PathVariable Long id) {
        return onibusService.buscarPorId(id);
    }

    @DeleteMapping("/deletar/{id}")
    public void deletar(@PathVariable Long id) {
        onibusService.deletar(id);
    }
}
