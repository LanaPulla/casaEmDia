package com.br.lab.casaEmDiaAPI.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.br.lab.casaEmDiaAPI.entities.enums.PerfilFamiliaEnum;

public record AtualizarMembroRequest(
        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres")
        String nome,

        @NotNull(message = "O perfil é obrigatório")
        PerfilFamiliaEnum perfil,

        @Size(max = 40, message = "O parentesco deve ter no máximo 40 caracteres")
        String parentesco
) {}
