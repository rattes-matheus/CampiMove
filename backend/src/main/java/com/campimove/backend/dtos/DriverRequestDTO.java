package com.campimove.backend.dtos;

import jakarta.validation.constraints.*;

public record DriverRequestDTO(
        @NotBlank(message = "Nome é obrigatório")
        String name,

        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email inválido")
        String email,

        @NotBlank(message = "Telefone é obrigatório")
        String phone,

        @NotBlank(message = "CNH é obrigatória")
        String licenseNumber,

        @NotBlank(message = "Categoria da CNH é obrigatória")
        String licenseCategory,

        @NotNull(message = "Idade é obrigatória")
        @Min(value = 18, message = "Idade mínima é 18 anos")
        Integer age,

        @NotBlank(message = "Senha é obrigatória")
        @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
        String password
) {}