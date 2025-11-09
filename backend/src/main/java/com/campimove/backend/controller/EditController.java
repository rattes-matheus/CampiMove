package com.campimove.backend.controller;

import com.campimove.backend.dto.EditProfileDTO;
import com.campimove.backend.entity.User;
import com.campimove.backend.service.EditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:3000") 
public class EditController {

    @Autowired
    private EditService editService;

    @PutMapping("/{id}/editar")
    public ResponseEntity<User> editarPerfil(@PathVariable Long id, @RequestBody EditProfileDTO dto) {
        try {
            User atualizado = editService.atualizarPerfil(id, dto);
            return ResponseEntity.ok(atualizado);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> buscarPorId(@PathVariable Long id) {
        return editService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
