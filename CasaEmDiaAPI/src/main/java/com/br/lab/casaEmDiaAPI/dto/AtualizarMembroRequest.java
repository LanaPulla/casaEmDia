package com.br.lab.casaEmDiaAPI.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AtualizarMembroRequest(
        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres")
        String nome,

        //adicionar perfil de permissao

        @Size(max = 40, message = "O parentesco deve ter no máximo 40 caracteres")
        String parentesco
) {}

