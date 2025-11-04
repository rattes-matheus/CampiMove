package com.campimove.backand.controllers;

import com.campimove.backand.service.EditService;

@RestController
@RequestMapping("/edit")
@RequiredArgsConstructor

public class EditControler {
    @Autowired
    private EditService editProfileService;

    @PutMapping("/{id}")
    public ResponseEntity<User> atualizarPerfil(
            @PathVariable Long id,
            @ModelAttribute EditProfileDTO dto 
    ) {
        try {
            User atualizado = editProfileService.atualizarPerfil(id, dto);
            return ResponseEntity.ok(atualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

}
