package com.campimove.backend.dto;

import org.springframework.web.multipart.MultipartFile;

public class EditProfileDTO {
    private String nome;
    private String email;
    private MultipartFile imagem;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public MultipartFile getImagem() { return imagem; }
    public void setImagem(MultipartFile imagem) { this.imagem = imagem; }
}
