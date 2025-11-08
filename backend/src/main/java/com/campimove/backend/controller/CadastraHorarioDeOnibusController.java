package com.campimove.backend.controller;

import com.campimove.backend.dto.CadastraHorarioDeOnibusDTO;
import com.campimove.backend.entity.CadastraHorarioDeOnibus;
import com.campimove.backend.service.CadastraHorarioDeOnibusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/horarios")
public class CadastraHorarioDeOnibusController {

    @Autowired
    private CadastraHorarioDeOnibusService horarioService;

    @PostMapping("/cadastrar")
    public CadastraHorarioDeOnibus cadastrar(@RequestBody CadastraHorarioDeOnibusDTO dto) {
        return horarioService.cadastrarHorario(dto);
    }

    @GetMapping("/listar")
    public List<CadastraHorarioDeOnibus> listar() {
        return horarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public CadastraHorarioDeOnibus buscar(@PathVariable Long id) {
        return horarioService.buscarPorId(id);
    }

    @DeleteMapping("/deletar/{id}")
    public void deletar(@PathVariable Long id) {
        horarioService.deletar(id);
    }
}
