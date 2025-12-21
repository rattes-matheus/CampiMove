package com.campimove.backend.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record CreateBusDTO(
        @NotBlank(message = "Placa é obrigatória")
        @Pattern(regexp = "[A-Z]{3}[0-9][A-Z0-9][0-9]{2}", message = "Placa inválida. Formato: ABC1D23 ou ABC-1234")
        String plate,

        @NotBlank(message = "Empresa é obrigatória")
        String company,

        @NotNull(message = "Capacidade é obrigatória")
        @Min(value = 1, message = "Capacidade mínima: 1")
        Integer capacity,

        @NotBlank(message = "Modelo é obrigatório")
        String model,

        @NotNull(message = "Ano é obrigatório")
        @Min(value = 1990, message = "Ano mínimo: 1990")
        Integer year,

        Long driverId
) {}